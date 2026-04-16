import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type {
  RootStackParamList,
  MyTournament,
  TournamentStructure,
  TournamentMatch,
  TournamentGroup,
  TournamentBracket,
  TournamentTeam,
} from "../../types/navigation";
import { fetchMyTournament, activateTournament } from "../../api/tournaments";
import { useAuth } from "../../context/AuthContext";
import { colors, colorGradient } from "../../theme/colors";
import {
  tds,
  CARD_H,
  CARD_W,
  COL_GAP,
  SLOT_H,
  LABEL_H,
  LINE_W,
  LINE_COLOR,
} from "./MyTournamentDetail.styles";
import { ButtonBack, ButtonFullColored } from "../../components/Button/Button";
import { TabBar } from "../../components/TabBar/TabBar";

type Props = NativeStackScreenProps<RootStackParamList, "MyTournamentDetail">;

// ─── Live simulation ──────────────────────────────────────────────────────────

function simulateLiveUpdate(
  structure: TournamentStructure,
): TournamentStructure {
  if (structure.kind === "groups") {
    return {
      ...structure,
      groups: structure.groups.map((g) => ({
        ...g,
        matches: g.matches.map((m) => {
          if (m.status !== "live" || Math.random() >= 0.4) return m;
          const side = Math.random() < 0.5 ? "home" : "away";
          return {
            ...m,
            homeScore: side === "home" ? (m.homeScore ?? 0) + 1 : m.homeScore,
            awayScore: side === "away" ? (m.awayScore ?? 0) + 1 : m.awayScore,
          };
        }),
      })),
    };
  }
  if (structure.kind === "knockout") {
    return {
      kind: "knockout",
      bracket: {
        rounds: structure.bracket.rounds.map((r) => ({
          ...r,
          matches: r.matches.map((m) => {
            if (m.status !== "live" || Math.random() >= 0.4) return m;
            const side = Math.random() < 0.5 ? "home" : "away";
            return {
              ...m,
              homeScore: side === "home" ? (m.homeScore ?? 0) + 1 : m.homeScore,
              awayScore: side === "away" ? (m.awayScore ?? 0) + 1 : m.awayScore,
            };
          }),
        })),
      },
    };
  }
  return structure;
}

// ─── Standings computation ────────────────────────────────────────────────────

interface StandingRow {
  team: TournamentTeam;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gf: number;
  ga: number;
  pts: number;
}

function computeStandings(group: TournamentGroup): StandingRow[] {
  const map = new Map<string, StandingRow>();
  group.teams.forEach((t) =>
    map.set(t.id, {
      team: t,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      gf: 0,
      ga: 0,
      pts: 0,
    }),
  );
  group.matches.forEach((m) => {
    if (
      m.status === "scheduled" ||
      m.homeScore === null ||
      m.awayScore === null
    )
      return;
    const home = map.get(m.homeTeam.id);
    const away = map.get(m.awayTeam.id);
    if (!home || !away) return;
    home.played++;
    away.played++;
    home.gf += m.homeScore;
    home.ga += m.awayScore;
    away.gf += m.awayScore;
    away.ga += m.homeScore;
    if (m.homeScore > m.awayScore) {
      home.won++;
      home.pts += 3;
      away.lost++;
    } else if (m.homeScore < m.awayScore) {
      away.won++;
      away.pts += 3;
      home.lost++;
    } else {
      home.drawn++;
      home.pts++;
      away.drawn++;
      away.pts++;
    }
  });
  return Array.from(map.values()).sort((a, b) => {
    if (b.pts !== a.pts) return b.pts - a.pts;
    const gd = b.gf - b.ga - (a.gf - a.ga);
    if (gd !== 0) return gd;
    return b.gf - a.gf;
  });
}

// ─── BracketMatchCard ─────────────────────────────────────────────────────────

function BracketMatchCard({ match }: { match: TournamentMatch }) {
  const isLive = match.status === "live";
  return (
    <View style={[tds.bracketMatchCard, isLive && tds.bracketMatchCardLive]}>
      <View style={tds.bracketTeamRow}>
        <Text
          style={[
            tds.bracketTeamName,
            match.homeTeam.isMyTeam && tds.bracketTeamNameMy,
          ]}
          numberOfLines={1}
        >
          {match.homeTeam.name}
        </Text>
        <Text style={tds.bracketScore}>{match.homeScore ?? "–"}</Text>
      </View>
      <View style={[tds.bracketTeamRow, tds.bracketTeamRowLast]}>
        <Text
          style={[
            tds.bracketTeamName,
            match.awayTeam.isMyTeam && tds.bracketTeamNameMy,
          ]}
          numberOfLines={1}
        >
          {match.awayTeam.name}
        </Text>
        <Text style={tds.bracketScore}>{match.awayScore ?? "–"}</Text>
      </View>
    </View>
  );
}

// ─── KnockoutView ─────────────────────────────────────────────────────────────

function KnockoutView({ bracket }: { bracket: TournamentBracket }) {
  const { rounds } = bracket;
  const firstRoundCount = rounds[0]?.matches.length ?? 0;
  const totalH = LABEL_H + firstRoundCount * SLOT_H;
  const totalW = rounds.length * CARD_W + (rounds.length - 1) * COL_GAP + 32;

  function matchTop(roundIdx: number, matchIdx: number): number {
    const span = Math.pow(2, roundIdx);
    return LABEL_H + matchIdx * span * SLOT_H + ((span - 1) / 2) * SLOT_H;
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingBottom: 40,
        paddingTop: 16,
      }}
    >
      <View style={{ width: totalW, height: totalH }}>
        {rounds.map((round, rIdx) => {
          const x = rIdx * (CARD_W + COL_GAP);
          return (
            <React.Fragment key={rIdx}>
              {/* Round label */}
              <View
                style={{
                  position: "absolute",
                  left: x,
                  top: 0,
                  width: CARD_W,
                  height: LABEL_H,
                  justifyContent: "center",
                }}
              >
                <Text style={tds.bracketColLabelText}>{round.name}</Text>
              </View>

              {/* Match cards */}
              {round.matches.map((match, mIdx) => (
                <View
                  key={match.id}
                  style={{
                    position: "absolute",
                    left: x,
                    top: matchTop(rIdx, mIdx),
                  }}
                >
                  <BracketMatchCard match={match} />
                </View>
              ))}

              {/* Connector lines to next round */}
              {rIdx < rounds.length - 1 &&
                round.matches.map((_, mIdx) => {
                  if (mIdx % 2 !== 0) return null;
                  const partnerIdx = mIdx + 1;
                  if (partnerIdx >= round.matches.length) return null;
                  const y1 = matchTop(rIdx, mIdx) + CARD_H / 2;
                  const y2 = matchTop(rIdx, partnerIdx) + CARD_H / 2;
                  const yMid = (y1 + y2) / 2;
                  const lineX = x + CARD_W;
                  return (
                    <React.Fragment key={`conn-${rIdx}-${mIdx}`}>
                      {/* Horizontal: top match → midpoint */}
                      <View
                        style={{
                          position: "absolute",
                          left: lineX,
                          top: y1 - LINE_W / 2,
                          width: COL_GAP / 2,
                          height: LINE_W,
                          backgroundColor: LINE_COLOR,
                        }}
                      />
                      {/* Horizontal: bottom match → midpoint */}
                      <View
                        style={{
                          position: "absolute",
                          left: lineX,
                          top: y2 - LINE_W / 2,
                          width: COL_GAP / 2,
                          height: LINE_W,
                          backgroundColor: LINE_COLOR,
                        }}
                      />
                      {/* Vertical connector */}
                      <View
                        style={{
                          position: "absolute",
                          left: lineX + COL_GAP / 2 - LINE_W / 2,
                          top: y1,
                          width: LINE_W,
                          height: y2 - y1,
                          backgroundColor: LINE_COLOR,
                        }}
                      />
                      {/* Horizontal: midpoint → next round */}
                      <View
                        style={{
                          position: "absolute",
                          left: lineX + COL_GAP / 2,
                          top: yMid - LINE_W / 2,
                          width: COL_GAP / 2,
                          height: LINE_W,
                          backgroundColor: LINE_COLOR,
                        }}
                      />
                    </React.Fragment>
                  );
                })}
            </React.Fragment>
          );
        })}
      </View>
    </ScrollView>
  );
}

// ─── GroupsView ───────────────────────────────────────────────────────────────

function GroupsView({
  structure,
}: {
  structure: TournamentStructure & { kind: "groups" };
}) {
  const [activeTab, setActiveTab] = useState<"gironi" | "classifica">("gironi");

  return (
    <>
      <TabBar
        value={activeTab}
        onChange={setActiveTab}
        tabs={[
          { key: "gironi", label: "Gironi" },
          { key: "classifica", label: "Classifica" },
        ]}
        style={{ marginTop: 15, marginHorizontal: 20 }}
      />

      <ScrollView
        contentContainerStyle={tds.scroll}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === "gironi"
          ? structure.groups.map((group) => (
              <View key={group.id} style={tds.groupCard}>
                <Text style={tds.groupTitle}>{group.name}</Text>
                {group.matches.map((match) => (
                  <View key={match.id} style={tds.matchRow}>
                    <Text
                      style={[
                        tds.matchTeam,
                        match.homeTeam.isMyTeam && tds.matchTeamMy,
                      ]}
                      numberOfLines={1}
                    >
                      {match.homeTeam.name}
                    </Text>
                    <View style={{ alignItems: "center" }}>
                      <Text
                        style={[
                          tds.matchScore,
                          match.status === "live" && tds.matchScoreLive,
                        ]}
                      >
                        {match.status === "scheduled"
                          ? "–"
                          : `${match.homeScore} – ${match.awayScore}`}
                      </Text>
                      {match.status === "live" && (
                        <View style={tds.liveTag}>
                          <Text style={tds.liveTagText}>LIVE</Text>
                        </View>
                      )}
                      {match.round && (
                        <Text style={tds.matchRound}>{match.round}</Text>
                      )}
                    </View>
                    <Text
                      style={[
                        tds.matchTeam,
                        tds.matchTeamRight,
                        match.awayTeam.isMyTeam && tds.matchTeamMy,
                      ]}
                      numberOfLines={1}
                    >
                      {match.awayTeam.name}
                    </Text>
                  </View>
                ))}
              </View>
            ))
          : structure.groups.map((group) => {
              const rows = computeStandings(group);
              return (
                <View key={group.id} style={tds.groupCard}>
                  <Text style={tds.groupTitle}>{group.name}</Text>
                  <View style={tds.standingsHeader}>
                    <View style={{ flex: 1 }} />
                    {["G", "V", "P", "GF", "GA", "Pts"].map((h) => (
                      <Text key={h} style={tds.standingsHeaderCell}>
                        {h}
                      </Text>
                    ))}
                  </View>
                  {rows.map((row, idx) => (
                    <View key={row.team.id} style={tds.standingsRow}>
                      <Text style={tds.standingsPos}>{idx + 1}</Text>
                      <Text
                        style={[
                          tds.standingsTeam,
                          row.team.isMyTeam && tds.standingsTeamMy,
                        ]}
                        numberOfLines={1}
                      >
                        {row.team.name}
                      </Text>
                      <Text style={tds.standingsCell}>{row.played}</Text>
                      <Text style={tds.standingsCell}>{row.won}</Text>
                      <Text style={tds.standingsCell}>{row.drawn}</Text>
                      <Text style={tds.standingsCell}>{row.gf}</Text>
                      <Text style={tds.standingsCell}>{row.ga}</Text>
                      <Text style={tds.standingsPts}>{row.pts}</Text>
                    </View>
                  ))}
                </View>
              );
            })}
      </ScrollView>
    </>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function MyTournamentDetailScreen({ route, navigation }: Props) {
  const { tournamentId } = route.params;
  const { user } = useAuth();
  const insets = useSafeAreaInsets();

  const [tournament, setTournament] = useState<MyTournament | null>(null);
  const [structure, setStructure] = useState<TournamentStructure | null>(null);
  const [loading, setLoading] = useState(true);
  const [activating, setActivating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);

  useEffect(() => {
    fetchMyTournament(tournamentId).then((t) => {
      setTournament(t);
      setStructure(t.structure);
      setIsGenerated(t.isGenerated !== false);
      setLoading(false);
    });
  }, [tournamentId]);

  useEffect(() => {
    if (!isGenerated) return;
    const id = setInterval(() => {
      setStructure((prev) => (prev ? simulateLiveUpdate(prev) : prev));
    }, 5000);
    return () => clearInterval(id);
  }, [isGenerated]);

  const handleActivate = async () => {
    if (!user?.token || !tournament) return;
    setActivating(true);
    await activateTournament(tournament.id, user.token);
    setTournament((prev) => (prev ? { ...prev, isGenerated: true } : prev));
    setIsGenerated(true);
    setActivating(false);
  };

  if (loading || !tournament || !structure) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.gray,
        }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const notGenerated = !isGenerated;
  const statusLabel =
    tournament.status === "ongoing"
      ? "In corso"
      : tournament.status === "upcoming"
        ? "In arrivo"
        : "Terminato";

  return (
    <View style={tds.root}>
      <LinearGradient colors={colorGradient} style={{ paddingTop: insets.top }}>
        <View style={tds.header}>
          <View style={tds.headerTop}>
            <ButtonBack handleBtn={() => navigation.goBack()} />
            <Text style={tds.headerTitle} numberOfLines={1}>
              {tournament.name}
            </Text>
          </View>
          <View style={tds.statusBadge}>
            <View style={tds.statusDot} />
            <Text style={tds.statusText}>{statusLabel}</Text>
          </View>
        </View>
      </LinearGradient>

      {notGenerated ? (
        <View style={tds.waitingBox}>
          {tournament.isOrganizer ? (
            <>
              <Ionicons
                name="trophy-outline"
                size={48}
                color={colors.primary}
              />
              <Text style={tds.waitingTitle}>Genera il torneo</Text>
              <Text style={tds.waitingText}>
                Tutti i team sono pronti. Genera il bracket o i gironi per
                iniziare.
              </Text>
              <ButtonFullColored
                text="Genera torneo"
                handleBtn={handleActivate}
                loading={activating}
                isColored
              />
            </>
          ) : (
            <>
              <Ionicons
                name="time-outline"
                size={48}
                color={colors.placeholder}
              />
              <Text style={tds.waitingTitle}>In attesa del bracket</Text>
              <Text style={tds.waitingText}>
                L'organizzatore sta preparando il torneo. Torna tra poco.
              </Text>
            </>
          )}
        </View>
      ) : structure.kind === "groups" ? (
        <GroupsView structure={structure} />
      ) : (
        <KnockoutView bracket={structure.bracket} />
      )}
    </View>
  );
}
