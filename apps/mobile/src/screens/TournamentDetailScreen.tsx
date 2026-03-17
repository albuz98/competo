import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList, Tournament } from '../types';
import { fetchTournament, signUpForTournament } from '../api/tournaments';
import { useAuth } from '../context/AuthContext';

type Props = NativeStackScreenProps<RootStackParamList, 'TournamentDetail'>;

const STATUS_COLORS: Record<string, string> = {
  upcoming: '#3b82f6',
  ongoing: '#10b981',
  completed: '#6b7280',
};

function InfoItem({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <View style={styles.infoItem}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={[styles.infoValue, highlight && styles.highlightValue]}>{value}</Text>
    </View>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

export default function TournamentDetailScreen({ route }: Props) {
  const { tournamentId } = route.params;
  const { user } = useAuth();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState(true);
  const [signingUp, setSigningUp] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTournament(tournamentId)
      .then(setTournament)
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load tournament'))
      .finally(() => setLoading(false));
  }, [tournamentId]);

  const handleSignUp = async () => {
    if (!user || !tournament) return;
    setSigningUp(true);
    try {
      await signUpForTournament(tournament.id, user.token);
      setTournament((prev) =>
        prev
          ? { ...prev, isRegistered: true, currentParticipants: prev.currentParticipants + 1 }
          : prev,
      );
      Alert.alert('Registered!', 'You have successfully signed up for this tournament.', [
        { text: 'Great!' },
      ]);
    } catch (e) {
      Alert.alert('Error', e instanceof Error ? e.message : 'Sign up failed');
    } finally {
      setSigningUp(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4f46e5" />
      </View>
    );
  }

  if (error || !tournament) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error ?? 'Tournament not found'}</Text>
      </View>
    );
  }

  const startDate = new Date(tournament.startDate).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  const endDate = new Date(tournament.endDate).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const spotsLeft = tournament.maxParticipants - tournament.currentParticipants;
  const isFull = spotsLeft <= 0;
  const isCompleted = tournament.status === 'completed';
  const fillPercent = Math.min(
    (tournament.currentParticipants / tournament.maxParticipants) * 100,
    100,
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={[styles.statusBanner, { backgroundColor: STATUS_COLORS[tournament.status] }]}>
        <Text style={styles.statusBannerText}>{tournament.status.toUpperCase()}</Text>
      </View>

      <View style={styles.titleBlock}>
        <Text style={styles.title}>{tournament.name}</Text>
        <Text style={styles.game}>{tournament.game}</Text>
      </View>

      <View style={styles.infoGrid}>
        <InfoItem label="Organizer" value={tournament.organizer} />
        <InfoItem label="Location" value={tournament.location} />
        <InfoItem label="Entry Fee" value={tournament.entryFee} />
        <InfoItem label="Prize Pool" value={tournament.prizePool} highlight />
      </View>

      <Section title="Schedule">
        <InfoItem label="Start" value={startDate} />
        <InfoItem label="End" value={endDate} />
      </Section>

      <Section title="Participants">
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${fillPercent}%` }]} />
        </View>
        <Text style={styles.participantText}>
          {tournament.currentParticipants} / {tournament.maxParticipants}
          {isFull ? ' · Full' : ` · ${spotsLeft} spot${spotsLeft !== 1 ? 's' : ''} left`}
        </Text>
      </Section>

      <Section title="About">
        <Text style={styles.description}>{tournament.description}</Text>
      </Section>

      <Section title="Rules">
        {tournament.rules.map((rule, i) => (
          <View key={i} style={styles.ruleItem}>
            <Text style={styles.ruleNumber}>{i + 1}.</Text>
            <Text style={styles.ruleText}>{rule}</Text>
          </View>
        ))}
      </Section>

      <View style={styles.signUpContainer}>
        {tournament.isRegistered ? (
          <View style={styles.registeredBadge}>
            <Text style={styles.registeredText}>✓ You're registered</Text>
          </View>
        ) : isCompleted ? (
          <Text style={styles.closedText}>This tournament has ended</Text>
        ) : isFull ? (
          <Text style={styles.closedText}>Tournament is full</Text>
        ) : (
          <TouchableOpacity
            style={[styles.signUpBtn, signingUp && styles.signUpBtnDisabled]}
            onPress={handleSignUp}
            disabled={signingUp}
            activeOpacity={0.8}
          >
            {signingUp ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.signUpBtnText}>Sign Up for Tournament</Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { paddingBottom: 40 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, minHeight: 300 },
  statusBanner: { paddingVertical: 7, alignItems: 'center' },
  statusBannerText: { color: '#fff', fontWeight: '700', fontSize: 11, letterSpacing: 1.5 },
  titleBlock: { padding: 16, paddingBottom: 8 },
  title: { fontSize: 22, fontWeight: '800', color: '#1e293b', marginBottom: 4 },
  game: { fontSize: 14, color: '#4f46e5', fontWeight: '600' },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 8,
    marginBottom: 4,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 12,
  },
  infoItem: { width: '50%', paddingHorizontal: 8, paddingVertical: 8 },
  infoLabel: { fontSize: 10, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 3 },
  infoValue: { fontSize: 14, fontWeight: '600', color: '#1e293b' },
  highlightValue: { color: '#f59e0b', fontSize: 16 },
  section: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 4,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e2e8f0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: { height: '100%', backgroundColor: '#4f46e5', borderRadius: 4 },
  participantText: { fontSize: 13, color: '#64748b' },
  description: { fontSize: 14, color: '#475569', lineHeight: 22 },
  ruleItem: { flexDirection: 'row', marginBottom: 10, alignItems: 'flex-start' },
  ruleNumber: { fontSize: 14, fontWeight: '700', color: '#4f46e5', width: 24, marginTop: 1 },
  ruleText: { flex: 1, fontSize: 14, color: '#475569', lineHeight: 20 },
  signUpContainer: { paddingHorizontal: 16, paddingTop: 24 },
  signUpBtn: {
    backgroundColor: '#4f46e5',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  signUpBtnDisabled: { opacity: 0.6 },
  signUpBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  registeredBadge: {
    backgroundColor: '#dcfce7',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  registeredText: { color: '#16a34a', fontSize: 15, fontWeight: '700' },
  closedText: { textAlign: 'center', color: '#94a3b8', fontSize: 14, fontWeight: '500' },
  errorText: { color: '#ef4444', fontSize: 14 },
});
