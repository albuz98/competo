import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type {
  RootStackParamList,
  MyTournament,
  TournamentStructure,
  TournamentGroup,
  TournamentMatch,
  TournamentTeam,
  TournamentBracket,
} from '../types';
import { fetchMyTournament, activateTournament } from '../api/tournaments';
import { useAuth } from '../context/AuthContext';

type Props = NativeStackScreenProps<RootStackParamList, 'MyTournamentDetail'>;
type Tab = 'gironi' | 'classifica';

// ─── Live pulsing dot ────────────────────────────────────────────────────────

function LiveDot() {
  const anim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 0.15, duration: 500, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 1, duration: 500, useNativeDriver: true }),
      ]),
    ).start();
  }, []);
  return <Animated.View style={[s.liveDot, { opacity: anim }]} />;
}

// ─── Match row ───────────────────────────────────────────────────────────────

function MatchRow({ match }: { match: TournamentMatch }) {
  const isLive = match.status === 'live';
  const isScheduled = match.status === 'scheduled';
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
          {match.homeScore !== null ? match.homeScore : '–'} :{' '}
          {match.awayScore !== null ? match.awayScore : '–'}
        </Text>
      </View>
      <Text
        style={[s.matchTeam, s.matchTeamRight, match.awayTeam.isMyTeam && s.matchMyTeam]}
        numberOfLines={1}
      >
        {match.awayTeam.name}
      </Text>
    </View>
  );
}

// ─── Group card ──────────────────────────────────────────────────────────────

function GroupCard({ group, isMyGroup }: { group: TournamentGroup; isMyGroup: boolean }) {
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
  group.teams.forEach((t) => map.set(t.id, { team: t, w: 0, d: 0, l: 0, pts: 0 }));
  group.matches.forEach((m) => {
    if (m.status !== 'finished' || m.homeScore === null || m.awayScore === null) return;
    const home = map.get(m.homeTeam.id);
    const away = map.get(m.awayTeam.id);
    if (!home || !away) return;
    if (m.homeScore > m.awayScore) {
      home.w++; home.pts += 3; away.l++;
    } else if (m.homeScore < m.awayScore) {
      away.w++; away.pts += 3; home.l++;
    } else {
      home.d++; home.pts++; away.d++; away.pts++;
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
        <View key={st.team.id} style={[s.standingsRow, st.team.isMyTeam && s.standingsRowMine]}>
          <Text style={[s.sCell, s.sCellPos]}>{i + 1}</Text>
          <Text style={[s.sCell, s.sCellName]} numberOfLines={1}>{st.team.name}</Text>
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

const CARD_H = 72;
const CARD_W = 158;
const COL_GAP = 44;
const SLOT_H = 84;
const LABEL_H = 28;
const LINE_W = 1.5;
const LINE_COLOR = '#dde3ed';

const getMatchCenterY = (roundIdx: number, matchIdx: number) => {
  const slotSize = SLOT_H * Math.pow(2, roundIdx);
  return LABEL_H + matchIdx * slotSize + slotSize / 2;
};
const getMatchTop = (roundIdx: number, matchIdx: number) =>
  getMatchCenterY(roundIdx, matchIdx) - CARD_H / 2;
const getColLeft = (roundIdx: number) => roundIdx * (CARD_W + COL_GAP);

function BracketMatchCard({ match }: { match: TournamentMatch }) {
  const isLive = match.status === 'live';
  const isFinished = match.status === 'finished';
  const homeWins = isFinished && match.homeScore !== null && match.awayScore !== null && match.homeScore > match.awayScore!;
  const awayWins = isFinished && match.homeScore !== null && match.awayScore !== null && match.awayScore! > match.homeScore!;

  return (
    <View style={[bStyles.matchCard, isLive && bStyles.matchCardLive]}>
      <View style={bStyles.teamRow}>
        <View style={[bStyles.teamDot, match.homeTeam.isMyTeam && bStyles.teamDotMine]} />
        <Text style={[bStyles.teamName, match.homeTeam.isMyTeam && bStyles.teamNameMine, homeWins && bStyles.teamNameWinner]} numberOfLines={1}>
          {match.homeTeam.name}
        </Text>
        <Text style={[bStyles.score, homeWins && bStyles.scoreWinner]}>
          {match.homeScore ?? '–'}
        </Text>
      </View>
      <View style={bStyles.matchDivider} />
      <View style={bStyles.teamRow}>
        <View style={[bStyles.teamDot, match.awayTeam.isMyTeam && bStyles.teamDotMine]} />
        <Text style={[bStyles.teamName, match.awayTeam.isMyTeam && bStyles.teamNameMine, awayWins && bStyles.teamNameWinner]} numberOfLines={1}>
          {match.awayTeam.name}
        </Text>
        <Text style={[bStyles.score, awayWins && bStyles.scoreWinner]}>
          {match.awayScore ?? '–'}
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

const bStyles = StyleSheet.create({
  roundLabel: {
    position: 'absolute',
    top: 0,
    textAlign: 'center',
    fontSize: 9,
    fontWeight: '700',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  matchCard: {
    height: CARD_H,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  matchCardLive: {
    borderColor: '#E8601A',
    borderLeftWidth: 3,
  },
  teamRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    gap: 5,
  },
  teamDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#e2e8f0',
  },
  teamDotMine: { backgroundColor: '#E8601A' },
  teamName: {
    flex: 1,
    fontSize: 10,
    fontWeight: '600',
    color: '#475569',
  },
  teamNameMine: { color: '#E8601A', fontWeight: '800' },
  teamNameWinner: { color: '#1e293b', fontWeight: '800' },
  score: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94a3b8',
    minWidth: 18,
    textAlign: 'center',
  },
  scoreWinner: { color: '#1e293b', fontWeight: '800' },
  matchDivider: { height: 0.5, backgroundColor: '#f1f5f9', marginHorizontal: 8 },
  livePill: {
    position: 'absolute',
    top: 2,
    right: 4,
    backgroundColor: 'transparent',
  },
  livePillText: { fontSize: 7, fontWeight: '800', color: '#E8601A', letterSpacing: 0.5 },
});

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
        <View key={`c-${r}-${p}-1`} style={{ position: 'absolute', top: y1 - LINE_W / 2, left: xExit, width: COL_GAP / 2, height: LINE_W, backgroundColor: LINE_COLOR }} />,
        <View key={`c-${r}-${p}-2`} style={{ position: 'absolute', top: y2 - LINE_W / 2, left: xExit, width: COL_GAP / 2, height: LINE_W, backgroundColor: LINE_COLOR }} />,
        <View key={`c-${r}-${p}-3`} style={{ position: 'absolute', top: y1, left: xJunction - LINE_W / 2, width: LINE_W, height: y2 - y1, backgroundColor: LINE_COLOR }} />,
        <View key={`c-${r}-${p}-4`} style={{ position: 'absolute', top: yRes - LINE_W / 2, left: xJunction, width: COL_GAP / 2, height: LINE_W, backgroundColor: LINE_COLOR }} />,
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
        <View style={{ width: bracketW, height: bracketH, position: 'relative' }}>
          {rounds.map((round, r) => (
            <Text key={`label-${r}`} style={[bStyles.roundLabel, { left: getColLeft(r), width: CARD_W }]}>
              {round.name}
            </Text>
          ))}
          {connectorLines}
          {rounds.map((round, r) => (
            <React.Fragment key={`round-${r}`}>
              {round.matches.map((match, m) => (
                <View key={match.id} style={{ position: 'absolute', left: getColLeft(r), top: getMatchTop(r, m), width: CARD_W }}>
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

function simulateLiveUpdate(structure: TournamentStructure): TournamentStructure {
  if (Math.random() > 0.4) return structure;
  const scoringTeam = Math.random() < 0.5 ? 'home' : 'away';

  if (structure.kind === 'groups') {
    const groups = structure.groups.map((g) => ({
      ...g,
      matches: g.matches.map((m) => {
        if (m.status !== 'live') return m;
        return {
          ...m,
          homeScore: scoringTeam === 'home' ? (m.homeScore ?? 0) + 1 : m.homeScore,
          awayScore: scoringTeam === 'away' ? (m.awayScore ?? 0) + 1 : m.awayScore,
        };
      }),
    }));
    return { ...structure, groups };
  } else {
    const rounds = structure.bracket.rounds.map((r) => ({
      ...r,
      matches: r.matches.map((m) => {
        if (m.status !== 'live') return m;
        return {
          ...m,
          homeScore: scoringTeam === 'home' ? (m.homeScore ?? 0) + 1 : m.homeScore,
          awayScore: scoringTeam === 'away' ? (m.awayScore ?? 0) + 1 : m.awayScore,
        };
      }),
    }));
    return { kind: 'knockout', bracket: { rounds } };
  }
}

// ─── Main screen ──────────────────────────────────────────────────────────────

export default function MyTournamentDetailScreen({ route, navigation }: Props) {
  const { tournamentId } = route.params;
  const { user } = useAuth();
  const [tournament, setTournament] = useState<MyTournament | null>(null);
  const [structure, setStructure] = useState<TournamentStructure | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>('gironi');
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchMyTournament(tournamentId)
      .then((t) => {
        setTournament(t);
        setStructure(t.structure);
      })
      .finally(() => setLoading(false));
  }, [tournamentId]);

  const handleGenerate = async () => {
    if (!tournament || generating) return;
    setGenerating(true);
    try {
      await activateTournament(tournament.id, user?.token ?? '');
      setTournament((prev) => prev ? { ...prev, isGenerated: true } : prev);
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
      <LinearGradient colors={['#E8601A', '#F5A020']} style={s.center}>
        <ActivityIndicator size="large" color="#fff" />
      </LinearGradient>
    );
  }

  if (!tournament || !structure) {
    return (
      <View style={s.center}>
        <Text style={{ color: '#ef4444' }}>Torneo non trovato</Text>
      </View>
    );
  }

  const startDate = new Date(tournament.startDate).toLocaleDateString('it-IT', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>

        {/* ── Orange gradient header ────────────────── */}
        <LinearGradient colors={['#E8601A', '#F5A020']} style={s.header}>
          <SafeAreaView edges={['top']}>
            <View style={s.headerTop}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn} activeOpacity={0.7}>
                <Ionicons name="arrow-back" size={22} color="#fff" />
              </TouchableOpacity>
              <View style={s.headerBadges}>
                <View style={[s.statusBadge, { backgroundColor: '#10b981' }]}>
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
        {structure.kind === 'groups' && tournament.isGenerated !== false && (
          <View style={s.tabBar}>
            <TouchableOpacity
              style={[s.tab, tab === 'gironi' && s.tabActive]}
              onPress={() => setTab('gironi')}
            >
              <Text style={[s.tabText, tab === 'gironi' && s.tabTextActive]}>Gironi</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[s.tab, tab === 'classifica' && s.tabActive]}
              onPress={() => setTab('classifica')}
            >
              <Text style={[s.tabText, tab === 'classifica' && s.tabTextActive]}>Classifica</Text>
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
                  ? 'Sei l\'organizzatore di questo torneo. Genera il tabellone per far iniziare la competizione.'
                  : 'L\'organizzatore deve ancora generare il tabellone. Torna più tardi.'}
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
              {structure.kind === 'groups' && tab === 'gironi' && (
                <>
                  {[...structure.groups]
                    .sort((a, b) =>
                      a.id === structure.userGroupId ? -1 : b.id === structure.userGroupId ? 1 : 0,
                    )
                    .map((g) => (
                      <GroupCard key={g.id} group={g} isMyGroup={g.id === structure.userGroupId} />
                    ))}
                </>
              )}

              {structure.kind === 'groups' && tab === 'classifica' && (
                <>
                  {structure.groups.map((g) => (
                    <StandingsTable key={g.id} group={g} />
                  ))}
                </>
              )}

              {structure.kind === 'knockout' && (
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

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#f8fafc' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  // Header
  header: { paddingBottom: 24 },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(0,0,0,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerBadges: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  statusBadge: { borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5 },
  statusText: { color: '#fff', fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  iscrittoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  iscrittoText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  headerContent: { paddingHorizontal: 20 },
  headerGame: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  headerTitle: { color: '#fff', fontSize: 22, fontWeight: '800', lineHeight: 28 },
  headerDate: { color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 4 },

  // Tab bar
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: { borderBottomColor: '#E8601A' },
  tabText: { fontSize: 14, fontWeight: '600', color: '#94a3b8' },
  tabTextActive: { color: '#E8601A', fontWeight: '800' },

  // Body
  body: { padding: 16, gap: 12 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 12,
  },

  // Group card
  groupCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  groupCardMine: { borderLeftWidth: 4, borderLeftColor: '#E8601A' },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  groupName: { fontSize: 13, fontWeight: '800', color: '#1e293b', flex: 1 },
  myGroupBadge: {
    backgroundColor: '#FFF0E6',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  myGroupBadgeText: { fontSize: 11, color: '#E8601A', fontWeight: '700' },

  // Match row
  matchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f8fafc',
  },
  matchRowHighlight: { backgroundColor: '#FFF8F5' },
  matchTeam: { flex: 1, fontSize: 12, color: '#475569', fontWeight: '500' },
  matchTeamRight: { textAlign: 'right' },
  matchMyTeam: { color: '#E8601A', fontWeight: '700' },
  matchScoreWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    minWidth: 70,
    justifyContent: 'center',
  },
  matchScore: { fontSize: 15, fontWeight: '800', color: '#1e293b' },
  matchScoreLive: { color: '#E8601A' },
  matchScoreScheduled: { color: '#94a3b8', fontWeight: '600' },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#ef4444',
  },

  // Standings
  standingsCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  standingsGroupName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1e293b',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  standingsHeader: {
    flexDirection: 'row',
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#f8fafc',
  },
  standingsRow: {
    flexDirection: 'row',
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: '#f8fafc',
  },
  standingsRowMine: { backgroundColor: '#FFF0E6' },
  sCell: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    width: 28,
    fontWeight: '600',
  },
  sCellPos: { color: '#94a3b8', width: 22 },
  sCellName: { flex: 1, textAlign: 'left', width: undefined },
  sCellPts: { color: '#E8601A', fontWeight: '800' },

  // Waiting / generate state
  waitingCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 28,
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  waitingTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1e293b',
    textAlign: 'center',
  },
  waitingSubtitle: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
  },
  generateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#E8601A',
    borderRadius: 50,
    paddingVertical: 14,
    paddingHorizontal: 32,
    marginTop: 8,
    minWidth: 200,
  },
  generateBtnDisabled: { opacity: 0.6 },
  generateBtnText: { color: '#fff', fontSize: 15, fontWeight: '800' },

  // Knockout bracket wrapper card
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1e293b',
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
});
