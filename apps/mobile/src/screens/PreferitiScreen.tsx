import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList, Tournament } from '../types';
import { useFavorites } from '../context/FavoritesContext';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const STATUS_LABEL: Record<string, string> = {
  upcoming: 'In arrivo',
  ongoing: 'In corso',
  completed: 'Terminato',
};
const STATUS_COLOR: Record<string, string> = {
  upcoming: '#3b82f6',
  ongoing: '#10b981',
  completed: '#6b7280',
};

function TournamentCard({ item, onPress, onRemove }: { item: Tournament; onPress: () => void; onRemove: () => void }) {
  return (
    <TouchableOpacity style={pf.card} onPress={onPress} activeOpacity={0.85}>
      <View style={pf.cardHeader}>
        <View style={pf.cardHeaderLeft}>
          <Text style={pf.cardGame}>{item.game}</Text>
          <Text style={pf.cardName} numberOfLines={2}>{item.name}</Text>
        </View>
        <TouchableOpacity style={pf.bookmarkBtn} onPress={onRemove} activeOpacity={0.7} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons name="bookmark" size={20} color="#E8601A" />
        </TouchableOpacity>
      </View>
      <View style={pf.cardFooter}>
        <View style={[pf.statusBadge, { backgroundColor: STATUS_COLOR[item.status] + '22' }]}>
          <Text style={[pf.statusText, { color: STATUS_COLOR[item.status] }]}>{STATUS_LABEL[item.status]}</Text>
        </View>
        <View style={pf.metaRow}>
          <Ionicons name="people-outline" size={12} color="#94a3b8" />
          <Text style={pf.metaText}>{item.currentParticipants}/{item.maxParticipants}</Text>
        </View>
        <View style={pf.metaRow}>
          <Ionicons name="location-outline" size={12} color="#94a3b8" />
          <Text style={pf.metaText} numberOfLines={1}>{item.location}</Text>
        </View>
        <Text style={pf.entryFee}>{item.entryFee}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function PreferitiScreen() {
  const navigation = useNavigation<Nav>();
  const { favorites, removeFavorite } = useFavorites();
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={pf.root} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <Text style={pf.header}>Preferiti</Text>
      {favorites.length === 0 ? (
        <View style={pf.center}>
          <Ionicons name="bookmark-outline" size={64} color="#e2e8f0" />
          <Text style={pf.emptyTitle}>Nessun preferito</Text>
          <Text style={pf.emptySubtitle}>Aggiungi tornei ai preferiti per trovarli facilmente</Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(t) => t.id}
          contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 20, gap: 12 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TournamentCard
              item={item}
              onPress={() => navigation.navigate('TournamentDetail', { tournamentId: item.id })}
              onRemove={() => removeFavorite(item.id)}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}

const pf = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff' },
  header: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1e293b',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: '#fff',
  },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  emptyTitle: { fontSize: 17, fontWeight: '700', color: '#94a3b8', marginTop: 16 },
  emptySubtitle: { fontSize: 13, color: '#cbd5e1', textAlign: 'center', marginTop: 8, lineHeight: 20 },

  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 12 },
  cardHeaderLeft: { flex: 1 },
  cardGame: {
    fontSize: 11,
    fontWeight: '700',
    color: '#E8601A',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  cardName: { fontSize: 16, fontWeight: '800', color: '#1e293b', lineHeight: 22 },
  bookmarkBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FFF0E6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardFooter: { flexDirection: 'row', alignItems: 'center', gap: 10, flexWrap: 'wrap' },
  statusBadge: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  statusText: { fontSize: 11, fontWeight: '700' },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  metaText: { fontSize: 12, color: '#94a3b8', maxWidth: 100 },
  entryFee: { marginLeft: 'auto' as any, fontSize: 13, fontWeight: '800', color: '#1e293b' },
});
