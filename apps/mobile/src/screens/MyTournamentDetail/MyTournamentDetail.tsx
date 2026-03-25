import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  MyTournament,
  RootStackParamList,
  TournamentBracket,
  TournamentGroup,
  TournamentMatch,
  TournamentStructure,
  TournamentTeam,
} from "../../types";
import { useAuth } from "../../context/AuthContext";
import { activateTournament, fetchMyTournament } from "../../api/tournaments";
import {
  bStyles,
  CARD_H,
  CARD_W,
  COL_GAP,
  LABEL_H,
  LINE_COLOR,
  LINE_W,
  s,
  SLOT_H,
} from "./MyTournamentDetail.styles";

type Props = NativeStackScreenProps<RootStackParamList, "MyTournamentDetail">;
type Tab = "gironi" | "classifica";

// ─── Live pulsing dot ────────────────────────────────────────────────────────

function LiveDot() {
  const anim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, {
          toValue: 0.15,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);
  return <Animated.View style={[s.liveDot, { opacity: anim }]} />;
}

// ─── Match row ───────────────────────────────────────────────────────────────

function MatchRow({ match }: { match: TournamentMatch }) {
  const isLive = match.status === "live";
  const isScheduled = match.status === "scheduled";
  const myMatch = match.homeTeam.isMyTeam || match.awayTeam.isMyTeam;

  return (
    <View style={[s.matchRow, myMatch && s.matchRowHighlight]}>
      <Text
        style={[s.matchTeam, match.homeTeam.isMyTeam && s.matchMyTeam]}
        numberOfLines={1}
      >
        {match.homeTeam.name}
      </Text>
      <View style={s.matchScoreWrap}>
        {isLive && <LiveDot />}
        <Text
          style={[
            s.matchScore,
            isLive && s.matchScoreLive,
            isScheduled && s.matchScoreScheduled,
          ]}
        >
          {match.homeScore !== null ? match.homeScore : "–"} :{" "}
          {match.awayScore !== null ? match.awayScore : "–"}
        </Text>
      </View>
      <Text
        style={[
          s.matchTeam,
          s.matchTeamRight,
          match.awayTeam.isMyTeam && s.matchMyTeam,
        ]}
        numberOfLines={1}
      >
        {match.awayTeam.name}
      </Text>
    </View>
  );
}

// ─── Group card ──────────────────────────────────────────────────────────────

function GroupCard({
  group,
  isMyGroup,
}: {
  group: TournamentGroup;
  isMyGroup: boolean;
}) {
  return (
    <View style={[s.groupCard, isMyGroup && s.groupCardMine]}>
      <View style={s.groupHeader}>
        <Text style={s.groupName}>{group.name}</Text>
        {isMyGroup && (
          <View style={s.myGroupBadge}>
            <Text style={s.myGroupBadgeText}>Il tuo girone</Text>
          </View>
        )}
      </View>
      {group.matches.map((m) => (
        <MatchRow key={m.id} match={m} />
      ))}
    </View>
  );
}

// ─── Standings ───────────────────────────────────────────────────────────────

interface Standing {
  team: TournamentTeam;
  w: number;
  d: number;
  l: number;
  pts: number;
}

function computeStandings(group: TournamentGroup): Standing[] {
  const map = new Map<string, Standing>();
  group.teams.forEach((t) =>
    map.set(t.id, { team: t, w: 0, d: 0, l: 0, pts: 0 }),
  );
  group.matches.forEach((m) => {
    if (m.status !== "finished" || m.homeScore === null || m.awayScore === null)
      return;
    const home = map.get(m.homeTeam.id);
    const away = map.get(m.awayTeam.id);
    if (!home || !away) return;
    if (m.homeScore > m.awayScore) {
      home.w++;
      home.pts += 3;
      away.l++;
    } else if (m.homeScore < m.awayScore) {
      away.w++;
      away.pts += 3;
      home.l++;
    } else {
      home.d++;
      home.pts++;
      away.d++;
      away.pts++;
    }
  });
  return Array.from(map.values()).sort((a, b) => b.pts - a.pts);
}

function StandingsTable({ group }: { group: TournamentGroup }) {
  const standings = computeStandings(group);
  return (
    <View style={s.standingsCard}>
      <Text style={s.standingsGroupName}>{group.name}</Text>
      <View style={s.standingsHeader}>
        <Text style={[s.sCell, s.sCellPos]}>#</Text>
        <Text style={[s.sCell, s.sCellName]}>Squadra</Text>
        <Text style={s.sCell}>V</Text>
        <Text style={s.sCell}>P</Text>
        <Text style={s.sCell}>S</Text>
        <Text style={[s.sCell, s.sCellPts]}>Pt</Text>
      </View>
      {standings.map((st, i) => (
        <View
          key={st.team.id}
          style={[s.standingsRow, st.team.isMyTeam && s.standingsRowMine]}
        >
          <Text style={[s.sCell, s.sCellPos]}>{i + 1}</Text>
          <Text style={[s.sCell, s.sCellName]} numberOfLines={1}>
            {st.team.name}
          </Text>
          <Text style={s.sCell}>{st.w}</Text>
          <Text style={s.sCell}>{st.d}</Text>
          <Text style={s.sCell}>{st.l}</Text>
          <Text style={[s.sCell, s.sCellPts]}>{st.pts}</Text>
        </View>
      ))}
    </View>
  );
}

// ─── Knockout bracket ────────────────────────────────────────────────────────

const getMatchCenterY = (roundIdx: number, matchIdx: number) => {
  const slotSize = SLOT_H * Math.pow(2, roundIdx);
  return LABEL_H + matchIdx * slotSize + slotSize / 2;
};
const getMatchTop = (roundIdx: number, matchIdx: number) =>
  getMatchCenterY(roundIdx, matchIdx) - CARD_H / 2;
const getColLeft = (roundIdx: number) => roundIdx * (CARD_W + COL_GAP);

function BracketMatchCard({ match }: { match: TournamentMatch }) {
  const isLive = match.status === "live";
  const isFinished = match.status === "finished";
  const homeWins =
    isFinished &&
    match.homeScore !== null &&
    match.awayScore !== null &&
    match.homeScore > match.awayScore!;
  const awayWins =
    isFinished &&
    match.homeScore !== null &&
    match.awayScore !== null &&
    match.awayScore! > match.homeScore!;

  return (
    <View style={[bStyles.matchCard, isLive && bStyles.matchCardLive]}>
      <View style={bStyles.teamRow}>
        <View
          style={[
            bStyles.teamDot,
            match.homeTeam.isMyTeam && bStyles.teamDotMine,
          ]}
        />
        <Text
          style={[
            bStyles.teamName,
            match.homeTeam.isMyTeam && bStyles.teamNameMine,
            homeWins && bStyles.teamNameWinner,
          ]}
          numberOfLines={1}
        >
          {match.homeTeam.name}
        </Text>
        <Text style={[bStyles.score, homeWins && bStyles.scoreWinner]}>
          {match.homeScore ?? "–"}
        </Text>
      </View>
      <View style={bStyles.matchDivider} />
      <View style={bStyles.teamRow}>
        <View
          style={[
            bStyles.teamDot,
            match.awayTeam.isMyTeam && bStyles.teamDotMine,
          ]}
        />
        <Text
          style={[
            bStyles.teamName,
            match.awayTeam.isMyTeam && bStyles.teamNameMine,
            awayWins && bStyles.teamNameWinner,
          ]}
          numberOfLines={1}
        >
          {match.awayTeam.name}
        </Text>
        <Text style={[bStyles.score, awayWins && bStyles.scoreWinner]}>
          {match.awayScore ?? "–"}
        </Text>
      </View>
      {isLive && (
        <View style={bStyles.livePill}>
          <Text style={bStyles.livePillText}>● LIVE</Text>
        </View>
      )}
    </View>
  );
}

function KnockoutBracket({ bracket }: { bracket: TournamentBracket }) {
  const { rounds } = bracket;
  const numRounds = rounds.length;
  const totalSlots = rounds[0]?.matches.length ?? 0;
  const bracketH = LABEL_H + totalSlots * SLOT_H;
  const bracketW = numRounds * CARD_W + (numRounds - 1) * COL_GAP;

  const connectorLines: React.ReactNode[] = [];
  for (let r = 0; r < numRounds - 1; r++) {
    const matchCount = rounds[r].matches.length;
    for (let p = 0; p < Math.floor(matchCount / 2); p++) {
      const y1 = getMatchCenterY(r, 2 * p);
      const y2 = getMatchCenterY(r, 2 * p + 1);
      const yRes = getMatchCenterY(r + 1, p);
      const xExit = getColLeft(r) + CARD_W;
      const xJunction = xExit + COL_GAP / 2;
      connectorLines.push(
        <View
          key={`c-${r}-${p}-1`}
          style={{
            position: "absolute",
            top: y1 - LINE_W / 2,
            left: xExit,
            width: COL_GAP / 2,
            height: LINE_W,
            backgroundColor: LINE_COLOR,
          }}
        />,
        <View
          key={`c-${r}-${p}-2`}
          style={{
            position: "absolute",
            top: y2 - LINE_W / 2,
            left: xExit,
            width: COL_GAP / 2,
            height: LINE_W,
            backgroundColor: LINE_COLOR,
          }}
        />,
        <View
          key={`c-${r}-${p}-3`}
          style={{
            position: "absolute",
            top: y1,
            left: xJunction - LINE_W / 2,
            width: LINE_W,
            height: y2 - y1,
            backgroundColor: LINE_COLOR,
          }}
        />,
        <View
          key={`c-${r}-${p}-4`}
          style={{
            position: "absolute",
            top: yRes - LINE_W / 2,
            left: xJunction,
            width: COL_GAP / 2,
            height: LINE_W,
            backgroundColor: LINE_COLOR,
          }}
        />,
      );
    }
  }

  return (
    <View style={s.card}>
      <Text style={s.cardTitle}>Tabellone</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 8, paddingHorizontal: 4 }}
      >
        <View
          style={{ width: bracketW, height: bracketH, position: "relative" }}
        >
          {rounds.map((round, r) => (
            <Text
              key={`label-${r}`}
              style={[
                bStyles.roundLabel,
                { left: getColLeft(r), width: CARD_W },
              ]}
            >
              {round.name}
            </Text>
          ))}
          {connectorLines}
          {rounds.map((round, r) => (
            <React.Fragment key={`round-${r}`}>
              {round.matches.map((match, m) => (
                <View
                  key={match.id}
                  style={{
                    position: "absolute",
                    left: getColLeft(r),
                    top: getMatchTop(r, m),
                    width: CARD_W,
                  }}
                >
                  <BracketMatchCard match={match} />
                </View>
              ))}
            </React.Fragment>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

// ─── Live score simulation ────────────────────────────────────────────────────

function simulateLiveUpdate(
  structure: TournamentStructure,
): TournamentStructure {
  if (Math.random() > 0.4) return structure;
  const scoringTeam = Math.random() < 0.5 ? "home" : "away";

  if (structure.kind === "groups") {
    const groups = structure.groups.map((g) => ({
      ...g,
      matches: g.matches.map((m) => {
        if (m.status !== "live") return m;
        return {
          ...m,
          homeScore:
            scoringTeam === "home" ? (m.homeScore ?? 0) + 1 : m.homeScore,
          awayScore:
            scoringTeam === "away" ? (m.awayScore ?? 0) + 1 : m.awayScore,
        };
      }),
    }));
    return { ...structure, groups };
  } else {
    const rounds = structure.bracket.rounds.map((r) => ({
      ...r,
      matches: r.matches.map((m) => {
        if (m.status !== "live") return m;
        return {
          ...m,
          homeScore:
            scoringTeam === "home" ? (m.homeScore ?? 0) + 1 : m.homeScore,
          awayScore:
            scoringTeam === "away" ? (m.awayScore ?? 0) + 1 : m.awayScore,
        };
      }),
    }));
    return { kind: "knockout", bracket: { rounds } };
  }
}

// ─── Main screen ──────────────────────────────────────────────────────────────

export default function MyTournamentDetail({ route, navigation }: Props) {
  const { tournamentId } = route.params;
  const { user } = useAuth();
  const [tournament, setTournament] = useState<MyTournament | null>(null);
  const [structure, setStructure] = useState<TournamentStructure | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("gironi");
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchMyTournament(tournamentId)
      .then((t) => {
        setTournament(t);
        setStructure(t.structure);
      })
      .finally(() => setLoading(false));
  }, [tournamentId]);

  // Safety redirect: organizer tournaments have their own dedicated screen
  useEffect(() => {
    if (tournament?.isOrganizer) {
      navigation.replace("OrganizerTournamentDetail", { tournamentId });
    }
  }, [tournament?.isOrganizer]);

  const handleGenerate = async () => {
    if (!tournament || generating) return;
    setGenerating(true);
    try {
      await activateTournament(tournament.id, user?.token ?? "");
      setTournament((prev) => (prev ? { ...prev, isGenerated: true } : prev));
    } finally {
      setGenerating(false);
    }
  };

  // Live score ticker
  const tickerActive = structure !== null && (tournament?.isGenerated ?? true);
  useEffect(() => {
    if (!tickerActive) return;
    const interval = setInterval(() => {
      setStructure((prev) => (prev ? simulateLiveUpdate(prev) : prev));
    }, 5000);
    return () => clearInterval(interval);
  }, [tickerActive]);

  if (loading) {
    return (
      <LinearGradient colors={["#E8601A", "#F5A020"]} style={s.center}>
        <ActivityIndicator size="large" color="#fff" />
      </LinearGradient>
    );
  }

  if (!tournament || !structure) {
    return (
      <View style={s.center}>
        <Text style={{ color: "#ef4444" }}>Torneo non trovato</Text>
      </View>
    );
  }

  const startDate = new Date(tournament.startDate).toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Orange gradient header ────────────────── */}
        <LinearGradient colors={["#E8601A", "#F5A020"]} style={s.header}>
          <SafeAreaView edges={["top"]}>
            <View style={s.headerTop}>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={s.backBtn}
                activeOpacity={0.7}
              >
                <Ionicons name="arrow-back" size={22} color="#fff" />
              </TouchableOpacity>
              <View style={s.headerBadges}>
                <View style={[s.statusBadge, { backgroundColor: "#10b981" }]}>
                  <Text style={s.statusText}>In corso</Text>
                </View>
                <View style={s.iscrittoBadge}>
                  <Ionicons name="checkmark-circle" size={12} color="#fff" />
                  <Text style={s.iscrittoText}>Iscritto</Text>
                </View>
              </View>
            </View>
            <View style={s.headerContent}>
              <Text style={s.headerGame}>{tournament.game}</Text>
              <Text style={s.headerTitle}>{tournament.name}</Text>
              <Text style={s.headerDate}>{startDate}</Text>
            </View>
          </SafeAreaView>
        </LinearGradient>

        {/* ── Tab bar (groups only, if generated) ─────────────────── */}
        {structure.kind === "groups" && tournament.isGenerated !== false && (
          <View style={s.tabBar}>
            <TouchableOpacity
              style={[s.tab, tab === "gironi" && s.tabActive]}
              onPress={() => setTab("gironi")}
            >
              <Text style={[s.tabText, tab === "gironi" && s.tabTextActive]}>
                Gironi
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[s.tab, tab === "classifica" && s.tabActive]}
              onPress={() => setTab("classifica")}
            >
              <Text
                style={[s.tabText, tab === "classifica" && s.tabTextActive]}
              >
                Classifica
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ── Body ──────────────────────────────────── */}
        <View style={s.body}>
          {tournament.isGenerated === false ? (
            /* Waiting state */
            <View style={s.waitingCard}>
              <Ionicons name="time-outline" size={48} color="#94a3b8" />
              <Text style={s.waitingTitle}>Torneo non ancora generato</Text>
              <Text style={s.waitingSubtitle}>
                {tournament.isOrganizer
                  ? "Sei l'organizzatore di questo torneo. Genera il tabellone per far iniziare la competizione."
                  : "L'organizzatore deve ancora generare il tabellone. Torna più tardi."}
              </Text>
              {tournament.isOrganizer && (
                <TouchableOpacity
                  style={[s.generateBtn, generating && s.generateBtnDisabled]}
                  onPress={handleGenerate}
                  disabled={generating}
                  activeOpacity={0.85}
                >
                  {generating ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <>
                      <Ionicons name="flash" size={18} color="#fff" />
                      <Text style={s.generateBtnText}>Genera torneo</Text>
                    </>
                  )}
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <>
              {structure.kind === "groups" && tab === "gironi" && (
                <>
                  {[...structure.groups]
                    .sort((a, b) =>
                      a.id === structure.userGroupId
                        ? -1
                        : b.id === structure.userGroupId
                          ? 1
                          : 0,
                    )
                    .map((g) => (
                      <GroupCard
                        key={g.id}
                        group={g}
                        isMyGroup={g.id === structure.userGroupId}
                      />
                    ))}
                </>
              )}

              {structure.kind === "groups" && tab === "classifica" && (
                <>
                  {structure.groups.map((g) => (
                    <StandingsTable key={g.id} group={g} />
                  ))}
                </>
              )}

              {structure.kind === "knockout" && (
                <>
                  <Text style={s.sectionTitle}>Il tuo tabellone</Text>
                  <KnockoutBracket bracket={structure.bracket} />
                </>
              )}
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
