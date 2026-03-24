import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  ActivityIndicator, StatusBar, Alert, Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type {
  RootStackParamList,
  OrganizerTournamentDetail,
  TournamentRegisteredTeam,
  TournamentPlayer,
  TournamentStructure,
  TournamentGroup,
  TournamentMatch,
  TournamentBracket,
} from '../types';
import {
  fetchOrganizerTournament,
  approveTeam,
  rejectTeam,
  removeTeam,
  activateTournament,
} from '../api/tournaments';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationsContext';

type Props = NativeStackScreenProps<RootStackParamList, 'OrganizerTournamentDetail'>;
type ActiveTab = 'dettagli' | 'squadre' | 'genera' | 'torneo';
type TorneoSubTab = 'gironi' | 'classifica';

const SPORT_EMOJI: Record<string, string> = {
  Calcio: '⚽', Basket: '🏀', Pallavolo: '🏐', Tennis: '🎾',
  Padel: '🏸', Rugby: '🏉', 'Ping Pong': '🏓', 'Calcio a 5': '⚽',
  'Beach Volley': '🏐', Badminton: '🏸',
};

const STATUS_CONFIG = {
  pending_approval: { label: 'In attesa', color: '#f59e0b', bg: '#fffbeb' },
  accepted: { label: 'Accettata', color: '#3b82f6', bg: '#eff6ff' },
  paid: { label: 'Pagata', color: '#10b981', bg: '#f0fdf4' },
  rejected: { label: 'Rifiutata', color: '#ef4444', bg: '#fef2f2' },
} as const;

const ROLE_LABELS: Record<string, string> = {
  representative: 'Referente', calciatore: 'Calciatore',
  allenatore: 'Allenatore', portiere: 'Portiere',
};

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

// ─── Live dot ─────────────────────────────────────────────────────────────────

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
  return <Animated.View style={[tv.liveDot, { opacity: anim }]} />;
}

// ─── Match row ────────────────────────────────────────────────────────────────

function MatchRow({ match }: { match: TournamentMatch }) {
  const isLive = match.status === 'live';
  const isScheduled = match.status === 'scheduled';
  const myMatch = match.homeTeam.isMyTeam || match.awayTeam.isMyTeam;
  return (
    <View style={[tv.matchRow, myMatch && tv.matchRowHighlight]}>
      <Text style={[tv.matchTeam, match.homeTeam.isMyTeam && tv.matchMyTeam]} numberOfLines={1}>
        {match.homeTeam.name}
      </Text>
      <View style={tv.matchScoreWrap}>
        {isLive && <LiveDot />}
        <Text style={[tv.matchScore, isLive && tv.matchScoreLive, isScheduled && tv.matchScoreScheduled]}>
          {match.homeScore !== null ? match.homeScore : '–'} : {match.awayScore !== null ? match.awayScore : '–'}
        </Text>
      </View>
      <Text style={[tv.matchTeam, tv.matchTeamRight, match.awayTeam.isMyTeam && tv.matchMyTeam]} numberOfLines={1}>
        {match.awayTeam.name}
      </Text>
    </View>
  );
}

// ─── Group card ───────────────────────────────────────────────────────────────

function GroupCard({ group, isMyGroup }: { group: TournamentGroup; isMyGroup: boolean }) {
  return (
    <View style={[tv.groupCard, isMyGroup && tv.groupCardMine]}>
      <View style={tv.groupHeader}>
        <Text style={tv.groupName}>{group.name}</Text>
        {isMyGroup && (
          <View style={tv.myGroupBadge}>
            <Text style={tv.myGroupBadgeText}>Il tuo girone</Text>
          </View>
        )}
      </View>
      {group.matches.map((m) => <MatchRow key={m.id} match={m} />)}
    </View>
  );
}

// ─── Standings ────────────────────────────────────────────────────────────────

interface Standing { team: { id: string; name: string; isMyTeam: boolean }; w: number; d: number; l: number; pts: number; }

function computeStandings(group: TournamentGroup): Standing[] {
  const map = new Map<string, Standing>();
  group.teams.forEach((t) => map.set(t.id, { team: t, w: 0, d: 0, l: 0, pts: 0 }));
  group.matches.forEach((m) => {
    if (m.status !== 'finished' || m.homeScore === null || m.awayScore === null) return;
    const home = map.get(m.homeTeam.id);
    const away = map.get(m.awayTeam.id);
    if (!home || !away) return;
    if (m.homeScore > m.awayScore) { home.w++; home.pts += 3; away.l++; }
    else if (m.homeScore < m.awayScore) { away.w++; away.pts += 3; home.l++; }
    else { home.d++; home.pts++; away.d++; away.pts++; }
  });
  return Array.from(map.values()).sort((a, b) => b.pts - a.pts);
}

function StandingsTable({ group }: { group: TournamentGroup }) {
  const standings = computeStandings(group);
  return (
    <View style={tv.standingsCard}>
      <Text style={tv.standingsGroupName}>{group.name}</Text>
      <View style={tv.standingsHeader}>
        <Text style={[tv.sCell, tv.sCellPos]}>#</Text>
        <Text style={[tv.sCell, tv.sCellName]}>Squadra</Text>
        <Text style={tv.sCell}>V</Text>
        <Text style={tv.sCell}>P</Text>
        <Text style={tv.sCell}>S</Text>
        <Text style={[tv.sCell, tv.sCellPts]}>Pt</Text>
      </View>
      {standings.map((st, i) => (
        <View key={st.team.id} style={[tv.standingsRow, st.team.isMyTeam && tv.standingsRowMine]}>
          <Text style={[tv.sCell, tv.sCellPos]}>{i + 1}</Text>
          <Text style={[tv.sCell, tv.sCellName]} numberOfLines={1}>{st.team.name}</Text>
          <Text style={tv.sCell}>{st.w}</Text>
          <Text style={tv.sCell}>{st.d}</Text>
          <Text style={tv.sCell}>{st.l}</Text>
          <Text style={[tv.sCell, tv.sCellPts]}>{st.pts}</Text>
        </View>
      ))}
    </View>
  );
}

// ─── Knockout bracket ─────────────────────────────────────────────────────────

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
const getMatchTop = (roundIdx: number, matchIdx: number) => getMatchCenterY(roundIdx, matchIdx) - CARD_H / 2;
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
        <Text style={[bStyles.score, homeWins && bStyles.scoreWinner]}>{match.homeScore ?? '–'}</Text>
      </View>
      <View style={bStyles.matchDivider} />
      <View style={bStyles.teamRow}>
        <View style={[bStyles.teamDot, match.awayTeam.isMyTeam && bStyles.teamDotMine]} />
        <Text style={[bStyles.teamName, match.awayTeam.isMyTeam && bStyles.teamNameMine, awayWins && bStyles.teamNameWinner]} numberOfLines={1}>
          {match.awayTeam.name}
        </Text>
        <Text style={[bStyles.score, awayWins && bStyles.scoreWinner]}>{match.awayScore ?? '–'}</Text>
      </View>
      {isLive && <View style={bStyles.livePill}><Text style={bStyles.livePillText}>● LIVE</Text></View>}
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
        <View key={`c-${r}-${p}-1`} style={{ position: 'absolute', top: y1 - LINE_W / 2, left: xExit, width: COL_GAP / 2, height: LINE_W, backgroundColor: LINE_COLOR }} />,
        <View key={`c-${r}-${p}-2`} style={{ position: 'absolute', top: y2 - LINE_W / 2, left: xExit, width: COL_GAP / 2, height: LINE_W, backgroundColor: LINE_COLOR }} />,
        <View key={`c-${r}-${p}-3`} style={{ position: 'absolute', top: y1, left: xJunction - LINE_W / 2, width: LINE_W, height: y2 - y1, backgroundColor: LINE_COLOR }} />,
        <View key={`c-${r}-${p}-4`} style={{ position: 'absolute', top: yRes - LINE_W / 2, left: xJunction, width: COL_GAP / 2, height: LINE_W, backgroundColor: LINE_COLOR }} />,
      );
    }
  }
  return (
    <View style={tv.bracketCard}>
      <Text style={tv.bracketCardTitle}>Tabellone</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 8, paddingHorizontal: 4 }}>
        <View style={{ width: bracketW, height: bracketH, position: 'relative' }}>
          {rounds.map((round, r) => (
            <Text key={`label-${r}`} style={[bStyles.roundLabel, { left: getColLeft(r), width: CARD_W }]}>{round.name}</Text>
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

// ─── Team item ────────────────────────────────────────────────────────────────

function TeamItem({
  team, expanded, onToggle, onApprove, onReject, onRemove, onPlayerPress, processing,
}: {
  team: TournamentRegisteredTeam;
  expanded: boolean;
  onToggle: () => void;
  onApprove: () => void;
  onReject: () => void;
  onRemove: () => void;
  onPlayerPress: (p: TournamentPlayer) => void;
  processing: boolean;
}) {
  const cfg = STATUS_CONFIG[team.status];
  const deadlineStr = team.paymentDeadline
    ? new Date(team.paymentDeadline).toLocaleDateString('it-IT', { day: '2-digit', month: 'short' })
    : null;

  return (
    <View style={os.teamCard}>
      <TouchableOpacity style={os.teamHeader} onPress={onToggle} activeOpacity={0.8}>
        <View style={os.teamHeaderLeft}>
          <View style={[os.statusPill, { backgroundColor: cfg.bg }]}>
            <View style={[os.statusDot, { backgroundColor: cfg.color }]} />
            <Text style={[os.statusPillText, { color: cfg.color }]}>{cfg.label}</Text>
          </View>
          <Text style={os.teamName} numberOfLines={1}>{team.name}</Text>
        </View>
        <View style={os.teamHeaderRight}>
          <Text style={os.playerCount}>{team.players.length} gioc.</Text>
          <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={16} color="#94a3b8" />
        </View>
      </TouchableOpacity>

      {team.status === 'accepted' && deadlineStr && (
        <View style={os.deadlineRow}>
          <Ionicons name="time-outline" size={13} color="#f59e0b" />
          <Text style={os.deadlineText}>Scadenza pagamento: {deadlineStr}</Text>
        </View>
      )}

      {processing ? (
        <View style={os.actionRow}><ActivityIndicator size="small" color="#E8601A" /></View>
      ) : (
        <>
          {team.status === 'pending_approval' && (
            <View style={os.actionRow}>
              <TouchableOpacity style={os.btnAccept} onPress={onApprove} activeOpacity={0.85}>
                <Ionicons name="checkmark" size={14} color="#fff" />
                <Text style={os.btnAcceptText}>Accetta</Text>
              </TouchableOpacity>
              <TouchableOpacity style={os.btnReject} onPress={onReject} activeOpacity={0.85}>
                <Ionicons name="close" size={14} color="#ef4444" />
                <Text style={os.btnRejectText}>Rifiuta</Text>
              </TouchableOpacity>
            </View>
          )}
          {team.status === 'accepted' && (
            <View style={os.actionRow}>
              <TouchableOpacity style={os.btnRemove} onPress={onRemove} activeOpacity={0.85}>
                <Ionicons name="trash-outline" size={14} color="#ef4444" />
                <Text style={os.btnRemoveText}>Rimuovi</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}

      {expanded && (
        <View style={os.playersContainer}>
          <View style={os.playersDivider} />
          {team.players.map((p) => (
            <TouchableOpacity key={p.id} style={os.playerRow} onPress={() => onPlayerPress(p)} activeOpacity={0.75}>
              <View style={os.playerAvatar}>
                <Text style={os.playerAvatarText}>{p.firstName[0].toUpperCase()}{p.lastName[0].toUpperCase()}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={os.playerName}>{p.firstName} {p.lastName}</Text>
                <Text style={os.playerRole}>{ROLE_LABELS[p.role] ?? p.role}</Text>
              </View>
              <Ionicons name="chevron-forward" size={14} color="#cbd5e1" />
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────

export default function OrganizerTournamentDetailScreen({ route, navigation }: Props) {
  const { tournamentId } = route.params;
  const { user } = useAuth();
  const { addNotification } = useNotifications();

  const [tournament, setTournament] = useState<OrganizerTournamentDetail | null>(null);
  const [structure, setStructure] = useState<TournamentStructure | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<ActiveTab>('dettagli');
  const [torneoSubTab, setTorneoSubTab] = useState<TorneoSubTab>('gironi');
  const [expandedTeamId, setExpandedTeamId] = useState<string | null>(null);
  const [processing, setProcessing] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchOrganizerTournament(tournamentId)
      .then((t) => {
        setTournament(t);
        if (t.isGenerated) setStructure(t.structure);
      })
      .finally(() => setLoading(false));
  }, [tournamentId]);

  // Live score ticker — only active after the tournament is generated
  useEffect(() => {
    if (!structure || !tournament?.isGenerated) return;
    const interval = setInterval(() => {
      setStructure((prev) => (prev ? simulateLiveUpdate(prev) : prev));
    }, 5000);
    return () => clearInterval(interval);
  }, [!!structure, tournament?.isGenerated]);

  const paidCount = tournament?.registeredTeams.filter((t) => t.status === 'paid').length ?? 0;
  const showGenerateTab = paidCount >= (tournament?.maxParticipants ?? Infinity) && !tournament?.isGenerated;
  const showTorneoTab = tournament?.isGenerated === true;

  const handleApprove = async (team: TournamentRegisteredTeam) => {
    if (!tournament) return;
    setProcessing(team.id);
    try {
      await approveTeam(tournament.id, team.id);
      const deadline = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
      setTournament((prev) =>
        prev ? {
          ...prev,
          registeredTeams: prev.registeredTeams.map((t) =>
            t.id === team.id ? { ...t, status: 'accepted', paymentDeadline: deadline } : t
          ),
        } : prev
      );
      addNotification({
        title: 'Squadra accettata!',
        body: `La squadra "${team.name}" è stata accettata al torneo "${tournament.name}". Il referente ha 7 giorni per pagare la quota.`,
        timestamp: new Date().toISOString(),
      });
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = (teamId: string, teamName: string) => {
    Alert.alert('Rifiuta squadra', `Sei sicuro di voler rifiutare "${teamName}"?`, [
      { text: 'Annulla', style: 'cancel' },
      {
        text: 'Rifiuta', style: 'destructive',
        onPress: async () => {
          if (!tournament) return;
          setProcessing(teamId);
          try {
            await rejectTeam(tournament.id, teamId);
            setTournament((prev) =>
              prev ? {
                ...prev,
                registeredTeams: prev.registeredTeams.map((t) =>
                  t.id === teamId ? { ...t, status: 'rejected' } : t
                ),
              } : prev
            );
          } finally {
            setProcessing(null);
          }
        },
      },
    ]);
  };

  const handleRemove = (teamId: string, teamName: string) => {
    Alert.alert('Rimuovi squadra', `Sei sicuro di voler rimuovere "${teamName}"?`, [
      { text: 'Annulla', style: 'cancel' },
      {
        text: 'Rimuovi', style: 'destructive',
        onPress: async () => {
          if (!tournament) return;
          setProcessing(teamId);
          try {
            await removeTeam(tournament.id, teamId);
            setTournament((prev) =>
              prev ? {
                ...prev,
                registeredTeams: prev.registeredTeams.filter((t) => t.id !== teamId),
              } : prev
            );
          } finally {
            setProcessing(null);
          }
        },
      },
    ]);
  };

  const handleGenerate = async () => {
    if (!tournament || generating) return;
    setGenerating(true);
    try {
      await activateTournament(tournament.id, user?.token ?? '');
      setStructure(tournament.structure);
      setTournament((prev) => (prev ? { ...prev, isGenerated: true } : prev));
      setTab('torneo');
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <LinearGradient colors={['#E8601A', '#F5A020']} style={os.center}>
        <ActivityIndicator size="large" color="#fff" />
      </LinearGradient>
    );
  }

  if (!tournament) {
    return <View style={os.center}><Text style={{ color: '#ef4444' }}>Torneo non trovato</Text></View>;
  }

  const startDate = new Date(tournament.startDate).toLocaleDateString('it-IT', { day: '2-digit', month: 'long', year: 'numeric' });
  const endDate = new Date(tournament.endDate).toLocaleDateString('it-IT', { day: '2-digit', month: 'long', year: 'numeric' });
  const emoji = SPORT_EMOJI[tournament.game] ?? '🏆';

  const nonRejected = tournament.registeredTeams.filter((t) => t.status !== 'rejected');
  const freeSlots = Math.max(0, tournament.maxParticipants - nonRejected.length);

  const tabs: { key: ActiveTab; label: string }[] = [
    { key: 'dettagli', label: 'Dettagli' },
    { key: 'squadre', label: 'Squadre' },
    ...(showGenerateTab ? [{ key: 'genera' as ActiveTab, label: 'Genera' }] : []),
    ...(showTorneoTab ? [{ key: 'torneo' as ActiveTab, label: 'Torneo' }] : []),
  ];

  return (
    <View style={os.root}>
      <StatusBar barStyle="light-content" />

      {/* ── Gradient header ───────────────────────── */}
      <LinearGradient colors={['#E8601A', '#F5A020']} style={os.header}>
        <SafeAreaView edges={['top']}>
          <View style={os.headerTop}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={os.backBtn} activeOpacity={0.7}>
              <Ionicons name="arrow-back" size={22} color="#fff" />
            </TouchableOpacity>
            <View style={os.organizerBadge}>
              <Ionicons name="shield-checkmark" size={12} color="#fff" />
              <Text style={os.organizerBadgeText}>Organizzatore</Text>
            </View>
          </View>
          <View style={os.headerContent}>
            <Text style={os.headerEmoji}>{emoji}</Text>
            <Text style={os.headerGame}>{tournament.game.toUpperCase()}</Text>
            <Text style={os.headerTitle}>{tournament.name}</Text>
            <Text style={os.headerDate}>{startDate}</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>

      {/* ── Tab bar ────────────────────────────────── */}
      <View style={os.tabBar}>
        {tabs.map((t) => (
          <TouchableOpacity
            key={t.key}
            style={[os.tab, tab === t.key && os.tabActive]}
            onPress={() => setTab(t.key)}
          >
            <Text style={[os.tabText, tab === t.key && os.tabTextActive]}>{t.label}</Text>
            {t.key === 'genera' && <View style={os.tabDot} />}
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={os.body} showsVerticalScrollIndicator={false}>

        {/* ─────────── TAB: DETTAGLI ─────────────── */}
        {tab === 'dettagli' && (
          <View style={os.card}>
            <InfoRow icon="calendar-outline" label="Inizio" value={startDate} />
            <InfoRow icon="calendar-outline" label="Fine" value={endDate} />
            <InfoRow icon="location-outline" label="Location" value={tournament.location} />
            <InfoRow icon="cash-outline" label="Quota iscrizione" value={tournament.entryFee} />
            <InfoRow icon="trophy-outline" label="Prize pool" value={tournament.prizePool} />
            <InfoRow icon="people-outline" label="Max squadre" value={String(tournament.maxParticipants)} />
            <InfoRow icon="shield-outline" label="Sport" value={tournament.game} isLast />
            {tournament.description ? (
              <View style={os.descBlock}>
                <Text style={os.descTitle}>Descrizione</Text>
                <Text style={os.descText}>{tournament.description}</Text>
              </View>
            ) : null}
            {tournament.rules && tournament.rules.length > 0 && (
              <View style={os.rulesBlock}>
                <Text style={os.descTitle}>Regolamento</Text>
                {tournament.rules.map((r, i) => (
                  <View key={i} style={os.ruleRow}>
                    <View style={os.ruleDot} />
                    <Text style={os.ruleText}>{r}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {/* ─────────── TAB: SQUADRE ──────────────── */}
        {tab === 'squadre' && (
          <>
            <View style={os.squadreHeader}>
              <View style={os.squadreCounter}>
                <Text style={os.squadreCountNum}>{nonRejected.length}</Text>
                <Text style={os.squadreCountSep}>/{tournament.maxParticipants}</Text>
              </View>
              <View>
                <Text style={os.squadreCountLabel}>Squadre iscritte</Text>
                <Text style={os.squadreFreeSlots}>{freeSlots} {freeSlots === 1 ? 'posto libero' : 'posti liberi'}</Text>
              </View>
            </View>
            {tournament.registeredTeams.length === 0 ? (
              <View style={os.emptyCard}>
                <Ionicons name="people-outline" size={40} color="#e2e8f0" />
                <Text style={os.emptyText}>Nessuna squadra iscritta</Text>
              </View>
            ) : (
              tournament.registeredTeams.map((team) => (
                <TeamItem
                  key={team.id}
                  team={team}
                  expanded={expandedTeamId === team.id}
                  onToggle={() => setExpandedTeamId((prev) => (prev === team.id ? null : team.id))}
                  onApprove={() => handleApprove(team)}
                  onReject={() => handleReject(team.id, team.name)}
                  onRemove={() => handleRemove(team.id, team.name)}
                  onPlayerPress={(p) => navigation.navigate('PlayerProfile', { playerJson: JSON.stringify(p) })}
                  processing={processing === team.id}
                />
              ))
            )}
          </>
        )}

        {/* ─────────── TAB: GENERA ───────────────── */}
        {tab === 'genera' && (
          <View style={os.generaCard}>
            <Ionicons name="flash" size={48} color="#E8601A" />
            <Text style={os.generaTitle}>Tutto pronto!</Text>
            <Text style={os.generaSubtitle}>
              Tutte le {tournament.maxParticipants} squadre hanno pagato la quota. Puoi generare il tabellone del torneo.
            </Text>
            <View style={os.generaStats}>
              <View style={os.generaStat}>
                <Text style={os.generaStatNum}>{tournament.maxParticipants}</Text>
                <Text style={os.generaStatLabel}>Squadre</Text>
              </View>
              <View style={os.generaStatDiv} />
              <View style={os.generaStat}>
                <Text style={os.generaStatNum}>{tournament.entryFee}</Text>
                <Text style={os.generaStatLabel}>Quota</Text>
              </View>
              <View style={os.generaStatDiv} />
              <View style={os.generaStat}>
                <Text style={os.generaStatNum}>{tournament.prizePool}</Text>
                <Text style={os.generaStatLabel}>Prize pool</Text>
              </View>
            </View>
            <TouchableOpacity
              style={[os.generateBtn, generating && os.generateBtnDisabled]}
              onPress={handleGenerate}
              disabled={generating}
              activeOpacity={0.85}
            >
              {generating ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Ionicons name="flash" size={18} color="#fff" />
                  <Text style={os.generateBtnText}>Genera Torneo</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* ─────────── TAB: TORNEO ───────────────── */}
        {tab === 'torneo' && structure && (
          <>
            {structure.kind === 'groups' && (
              <View style={os.subTabBar}>
                <TouchableOpacity
                  style={[os.subTab, torneoSubTab === 'gironi' && os.subTabActive]}
                  onPress={() => setTorneoSubTab('gironi')}
                >
                  <Text style={[os.subTabText, torneoSubTab === 'gironi' && os.subTabTextActive]}>Gironi</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[os.subTab, torneoSubTab === 'classifica' && os.subTabActive]}
                  onPress={() => setTorneoSubTab('classifica')}
                >
                  <Text style={[os.subTabText, torneoSubTab === 'classifica' && os.subTabTextActive]}>Classifica</Text>
                </TouchableOpacity>
              </View>
            )}

            {structure.kind === 'groups' && torneoSubTab === 'gironi' &&
              [...structure.groups]
                .sort((a, b) => a.id === structure.userGroupId ? -1 : b.id === structure.userGroupId ? 1 : 0)
                .map((g) => <GroupCard key={g.id} group={g} isMyGroup={g.id === structure.userGroupId} />)
            }

            {structure.kind === 'groups' && torneoSubTab === 'classifica' &&
              structure.groups.map((g) => <StandingsTable key={g.id} group={g} />)
            }

            {structure.kind === 'knockout' && <KnockoutBracket bracket={structure.bracket} />}
          </>
        )}
        {tab === 'torneo' && !structure && (
          <View style={os.emptyCard}>
            <ActivityIndicator size="large" color="#E8601A" />
          </View>
        )}

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

// ─── Info row helper ─────────────────────────────────────────────────────────

function InfoRow({ icon, label, value, isLast }: { icon: any; label: string; value: string; isLast?: boolean }) {
  return (
    <View style={[os.infoRow, isLast && os.infoRowLast]}>
      <Ionicons name={icon} size={18} color="#94a3b8" style={{ width: 26 }} />
      <View style={{ flex: 1 }}>
        <Text style={os.infoLabel}>{label}</Text>
        <Text style={os.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

// ─── Tournament view styles (bracket / groups / standings) ────────────────────

const tv = StyleSheet.create({
  liveDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#ef4444' },
  matchRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 14, paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: '#f8fafc',
  },
  matchRowHighlight: { backgroundColor: '#FFF8F5' },
  matchTeam: { flex: 1, fontSize: 12, color: '#475569', fontWeight: '500' },
  matchTeamRight: { textAlign: 'right' },
  matchMyTeam: { color: '#E8601A', fontWeight: '700' },
  matchScoreWrap: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 10, minWidth: 70, justifyContent: 'center',
  },
  matchScore: { fontSize: 15, fontWeight: '800', color: '#1e293b' },
  matchScoreLive: { color: '#E8601A' },
  matchScoreScheduled: { color: '#94a3b8', fontWeight: '600' },
  groupCard: {
    backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  groupCardMine: { borderLeftWidth: 4, borderLeftColor: '#E8601A' },
  groupHeader: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 14, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: '#f1f5f9',
  },
  groupName: { fontSize: 13, fontWeight: '800', color: '#1e293b', flex: 1 },
  myGroupBadge: { backgroundColor: '#FFF0E6', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3 },
  myGroupBadgeText: { fontSize: 11, color: '#E8601A', fontWeight: '700' },
  standingsCard: {
    backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  standingsGroupName: {
    fontSize: 13, fontWeight: '800', color: '#1e293b',
    padding: 14, borderBottomWidth: 1, borderBottomColor: '#f1f5f9',
  },
  standingsHeader: { flexDirection: 'row', paddingHorizontal: 14, paddingVertical: 8, backgroundColor: '#f8fafc' },
  standingsRow: {
    flexDirection: 'row', paddingHorizontal: 14, paddingVertical: 11,
    borderBottomWidth: 1, borderBottomColor: '#f8fafc',
  },
  standingsRowMine: { backgroundColor: '#FFF0E6' },
  sCell: { fontSize: 12, color: '#64748b', textAlign: 'center', width: 28, fontWeight: '600' },
  sCellPos: { color: '#94a3b8', width: 22 },
  sCellName: { flex: 1, textAlign: 'left', width: undefined },
  sCellPts: { color: '#E8601A', fontWeight: '800' },
  bracketCard: {
    backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  bracketCardTitle: {
    fontSize: 13, fontWeight: '800', color: '#1e293b',
    paddingHorizontal: 14, paddingTop: 14, paddingBottom: 8,
    borderBottomWidth: 1, borderBottomColor: '#f1f5f9',
  },
});

const bStyles = StyleSheet.create({
  roundLabel: {
    position: 'absolute', top: 0, textAlign: 'center',
    fontSize: 9, fontWeight: '700', color: '#94a3b8',
    textTransform: 'uppercase', letterSpacing: 0.8,
  },
  matchCard: {
    height: CARD_H, backgroundColor: '#fff', borderRadius: 10,
    borderWidth: 1, borderColor: '#e2e8f0', overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 3, elevation: 2,
  },
  matchCardLive: { borderColor: '#E8601A', borderLeftWidth: 3 },
  teamRow: { flex: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, gap: 5 },
  teamDot: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: '#e2e8f0' },
  teamDotMine: { backgroundColor: '#E8601A' },
  teamName: { flex: 1, fontSize: 10, fontWeight: '600', color: '#475569' },
  teamNameMine: { color: '#E8601A', fontWeight: '800' },
  teamNameWinner: { color: '#1e293b', fontWeight: '800' },
  score: { fontSize: 12, fontWeight: '600', color: '#94a3b8', minWidth: 18, textAlign: 'center' },
  scoreWinner: { color: '#1e293b', fontWeight: '800' },
  matchDivider: { height: 0.5, backgroundColor: '#f1f5f9', marginHorizontal: 8 },
  livePill: { position: 'absolute', top: 2, right: 4, backgroundColor: 'transparent' },
  livePillText: { fontSize: 7, fontWeight: '800', color: '#E8601A', letterSpacing: 0.5 },
});

// ─── Organizer screen styles ──────────────────────────────────────────────────

const os = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#f8fafc' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  header: { paddingBottom: 20 },
  headerTop: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 8, paddingBottom: 12,
  },
  backBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: 'rgba(0,0,0,0.15)', alignItems: 'center', justifyContent: 'center',
  },
  organizerBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5,
  },
  organizerBadgeText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  headerContent: { paddingHorizontal: 20, paddingBottom: 4 },
  headerEmoji: { fontSize: 32, marginBottom: 4 },
  headerGame: { color: 'rgba(255,255,255,0.8)', fontSize: 11, fontWeight: '700', letterSpacing: 1, marginBottom: 4 },
  headerTitle: { color: '#fff', fontSize: 22, fontWeight: '800', lineHeight: 28 },
  headerDate: { color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 4 },

  tabBar: { flexDirection: 'row', backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  tab: {
    flex: 1, paddingVertical: 14, alignItems: 'center',
    borderBottomWidth: 2, borderBottomColor: 'transparent',
    flexDirection: 'row', justifyContent: 'center', gap: 6,
  },
  tabActive: { borderBottomColor: '#E8601A' },
  tabText: { fontSize: 13, fontWeight: '600', color: '#94a3b8' },
  tabTextActive: { color: '#E8601A', fontWeight: '800' },
  tabDot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: '#10b981' },

  body: { padding: 16, gap: 12 },

  subTabBar: {
    flexDirection: 'row', backgroundColor: '#f1f5f9',
    borderRadius: 12, padding: 4,
  },
  subTab: { flex: 1, paddingVertical: 9, alignItems: 'center', borderRadius: 10 },
  subTabActive: {
    backgroundColor: '#fff',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08, shadowRadius: 3, elevation: 1,
  },
  subTabText: { fontSize: 13, fontWeight: '600', color: '#94a3b8' },
  subTabTextActive: { color: '#E8601A', fontWeight: '800' },

  card: {
    backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
  },
  infoRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 13,
    borderBottomWidth: 1, borderBottomColor: '#f1f5f9', gap: 8,
  },
  infoRowLast: { borderBottomWidth: 0 },
  infoLabel: { fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.4 },
  infoValue: { fontSize: 14, fontWeight: '600', color: '#1e293b', marginTop: 1 },
  descBlock: { padding: 16, borderTopWidth: 1, borderTopColor: '#f1f5f9' },
  rulesBlock: { padding: 16, borderTopWidth: 1, borderTopColor: '#f1f5f9' },
  descTitle: { fontSize: 13, fontWeight: '800', color: '#1e293b', marginBottom: 8 },
  descText: { fontSize: 13, color: '#64748b', lineHeight: 20 },
  ruleRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 6 },
  ruleDot: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: '#E8601A', marginTop: 6 },
  ruleText: { flex: 1, fontSize: 13, color: '#64748b', lineHeight: 19 },

  squadreHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: '#fff', borderRadius: 16, padding: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1,
  },
  squadreCounter: { flexDirection: 'row', alignItems: 'baseline' },
  squadreCountNum: { fontSize: 36, fontWeight: '800', color: '#E8601A' },
  squadreCountSep: { fontSize: 20, fontWeight: '600', color: '#94a3b8' },
  squadreCountLabel: { fontSize: 14, fontWeight: '700', color: '#1e293b' },
  squadreFreeSlots: { fontSize: 12, color: '#64748b', marginTop: 2 },

  teamCard: {
    backgroundColor: '#fff', borderRadius: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
    overflow: 'hidden',
  },
  teamHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 13, gap: 10 },
  teamHeaderLeft: { flex: 1, gap: 5 },
  teamHeaderRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  teamName: { fontSize: 14, fontWeight: '700', color: '#1e293b' },
  playerCount: { fontSize: 11, color: '#94a3b8' },
  statusPill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3, alignSelf: 'flex-start',
  },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusPillText: { fontSize: 11, fontWeight: '700' },
  deadlineRow: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 14, paddingBottom: 8 },
  deadlineText: { fontSize: 12, color: '#f59e0b', fontWeight: '600' },
  actionRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 14, paddingBottom: 12 },
  btnAccept: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 5, backgroundColor: '#10b981', borderRadius: 10, paddingVertical: 9,
  },
  btnAcceptText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  btnReject: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 5, borderWidth: 1.5, borderColor: '#fecaca', borderRadius: 10, paddingVertical: 9,
  },
  btnRejectText: { color: '#ef4444', fontSize: 13, fontWeight: '700' },
  btnRemove: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    borderWidth: 1.5, borderColor: '#fecaca', borderRadius: 10, paddingVertical: 8, paddingHorizontal: 16,
  },
  btnRemoveText: { color: '#ef4444', fontSize: 13, fontWeight: '700' },
  playersContainer: { paddingHorizontal: 14, paddingBottom: 8 },
  playersDivider: { height: 1, backgroundColor: '#f1f5f9', marginBottom: 10 },
  playerRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#f8fafc',
  },
  playerAvatar: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: '#fff7ed', alignItems: 'center', justifyContent: 'center',
  },
  playerAvatarText: { fontSize: 12, fontWeight: '800', color: '#E8601A' },
  playerName: { fontSize: 13, fontWeight: '600', color: '#1e293b' },
  playerRole: { fontSize: 11, color: '#94a3b8', marginTop: 1 },

  emptyCard: { backgroundColor: '#fff', borderRadius: 14, padding: 32, alignItems: 'center', gap: 10 },
  emptyText: { fontSize: 14, color: '#94a3b8', fontWeight: '500' },

  generaCard: {
    backgroundColor: '#fff', borderRadius: 16, padding: 28, alignItems: 'center', gap: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  generaTitle: { fontSize: 22, fontWeight: '800', color: '#1e293b' },
  generaSubtitle: { fontSize: 13, color: '#64748b', textAlign: 'center', lineHeight: 20 },
  generaStats: { flexDirection: 'row', alignItems: 'center', marginVertical: 4 },
  generaStat: { flex: 1, alignItems: 'center' },
  generaStatNum: { fontSize: 20, fontWeight: '800', color: '#1e293b' },
  generaStatLabel: { fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.4, marginTop: 2 },
  generaStatDiv: { width: 1, height: 36, backgroundColor: '#f1f5f9' },
  generateBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#E8601A', borderRadius: 50,
    paddingVertical: 15, paddingHorizontal: 36, marginTop: 8, minWidth: 220, justifyContent: 'center',
  },
  generateBtnDisabled: { opacity: 0.6 },
  generateBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});
