import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList, Tournament } from '../types';
import { fetchTournaments } from '../api/tournaments';
import { useAuth } from '../context/AuthContext';

const STATUS_COLORS: Record<string, string> = {
  upcoming: '#3b82f6',
  ongoing: '#10b981',
  completed: '#6b7280',
};

function TournamentCard({
  tournament,
  onPress,
}: {
  tournament: Tournament;
  onPress: () => void;
}) {
  const date = new Date(tournament.startDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const spotsLeft = tournament.maxParticipants - tournament.currentParticipants;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.cardHeader}>
        <Text style={styles.gameName}>{tournament.game}</Text>
        <View style={[styles.statusBadge, { backgroundColor: STATUS_COLORS[tournament.status] }]}>
          <Text style={styles.statusText}>{tournament.status.toUpperCase()}</Text>
        </View>
      </View>

      <Text style={styles.tournamentName} numberOfLines={2}>
        {tournament.name}
      </Text>

      <View style={styles.cardDetails}>
        <View style={styles.detail}>
          <Text style={styles.detailLabel}>Date</Text>
          <Text style={styles.detailValue}>{date}</Text>
        </View>
        <View style={styles.detail}>
          <Text style={styles.detailLabel}>Spots left</Text>
          <Text style={styles.detailValue}>
            {tournament.status === 'completed' ? '—' : spotsLeft === 0 ? 'Full' : spotsLeft}
          </Text>
        </View>
        <View style={styles.detail}>
          <Text style={styles.detailLabel}>Prize</Text>
          <Text style={[styles.detailValue, styles.prizeText]}>{tournament.prizePool}</Text>
        </View>
        <View style={styles.detail}>
          <Text style={styles.detailLabel}>Fee</Text>
          <Text style={styles.detailValue}>{tournament.entryFee}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function TournamentListScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user, logout } = useAuth();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      const data = await fetchTournaments();
      setTournaments(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load tournaments');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handlePress = (tournament: Tournament) => {
    if (!user) {
      navigation.navigate('Login', {
        redirect: 'tournament',
        tournamentId: tournament.id,
      });
    } else {
      navigation.navigate('TournamentDetail', { tournamentId: tournament.id });
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4f46e5" />
        <Text style={styles.loadingText}>Loading tournaments…</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={() => { setLoading(true); load(); }}>
          <Text style={styles.retryBtnText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <FlatList
        data={tournaments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TournamentCard tournament={item} onPress={() => handlePress(item)} />
        )}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              load();
            }}
            tintColor="#4f46e5"
          />
        }
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.emptyText}>No tournaments available</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { padding: 16, paddingBottom: 32 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, minHeight: 300 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  gameName: {
    fontSize: 11,
    color: '#6b7280',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    flex: 1,
    marginRight: 8,
  },
  statusBadge: { borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3 },
  statusText: { fontSize: 10, color: '#fff', fontWeight: '700', letterSpacing: 0.5 },
  tournamentName: { fontSize: 16, fontWeight: '700', color: '#1e293b', marginBottom: 14 },
  cardDetails: { flexDirection: 'row', justifyContent: 'space-between' },
  detail: { alignItems: 'center', flex: 1 },
  detailLabel: { fontSize: 10, color: '#94a3b8', marginBottom: 3, textTransform: 'uppercase' },
  detailValue: { fontSize: 13, fontWeight: '600', color: '#334155' },
  prizeText: { color: '#f59e0b' },
  loadingText: { marginTop: 12, color: '#6b7280', fontSize: 14 },
  errorText: { color: '#ef4444', textAlign: 'center', marginBottom: 16, fontSize: 14 },
  retryBtn: {
    backgroundColor: '#4f46e5',
    borderRadius: 10,
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  retryBtnText: { color: '#fff', fontWeight: '600' },
  emptyText: { color: '#6b7280', fontSize: 14 },
  headerBtn: { marginRight: 4, paddingVertical: 4, paddingHorizontal: 2 },
  headerBtnText: { color: '#fff', fontWeight: '600', fontSize: 14 },
});
