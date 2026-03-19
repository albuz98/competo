import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList, Team } from '../types';
import { useTeams } from '../context/TeamsContext';

type Props = NativeStackScreenProps<RootStackParamList, 'TeamSelect'>;

function RadioCircle({ selected }: { selected: boolean }) {
  return (
    <View style={[ts.radio, selected && ts.radioSelected]}>
      {selected && <View style={ts.radioDot} />}
    </View>
  );
}

function TeamCard({
  team,
  selected,
  onPress,
}: {
  team: Team;
  selected: boolean;
  onPress: () => void;
}) {
  const initials = team.name.slice(0, 2).toUpperCase();
  return (
    <TouchableOpacity
      style={[ts.teamCard, selected && ts.teamCardSelected]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <LinearGradient colors={['#E8601A', '#F5A020']} style={ts.teamAvatar}>
        <Text style={ts.teamAvatarText}>{initials}</Text>
      </LinearGradient>
      <View style={{ flex: 1 }}>
        <Text style={ts.teamName} numberOfLines={1}>{team.name}</Text>
        <Text style={ts.teamMeta}>{team.sport} · {team.members.length} giocatori</Text>
      </View>
      <RadioCircle selected={selected} />
    </TouchableOpacity>
  );
}

export default function TeamSelectScreen({ route, navigation }: Props) {
  const { tournamentId, entryFee, tournamentName } = route.params;
  const { teams, loading } = useTeams();
  const insets = useSafeAreaInsets();
  const [selectedId, setSelectedId] = useState<string | null>(() => teams[0]?.id ?? null);

  const selectedTeam = teams.find((t) => t.id === selectedId) ?? null;

  const handleContinue = () => {
    if (!selectedId || !selectedTeam) return;
    navigation.navigate('Payment', {
      tournamentId,
      entryFee,
      tournamentName,
      teamId: selectedId,
      teamName: selectedTeam.name,
    });
  };

  return (
    <View style={ts.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>

        {/* Header */}
        <View style={ts.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={ts.closeBtn} activeOpacity={0.7}>
            <Ionicons name="close" size={22} color="#1e293b" />
          </TouchableOpacity>
          <Text style={ts.headerTitle}>Scegli la tua squadra</Text>
          <View style={{ width: 36 }} />
        </View>

        <Text style={ts.subtitle} numberOfLines={2}>{tournamentName}</Text>

        {/* Team list */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={ts.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {loading ? (
            <ActivityIndicator color="#E8601A" style={{ marginTop: 32 }} />
          ) : teams.length === 0 ? (
            <View style={ts.emptyBox}>
              <Ionicons name="people-outline" size={48} color="#e2e8f0" />
              <Text style={ts.emptyText}>Nessuna squadra</Text>
              <Text style={ts.emptySubText}>
                Devi appartenere a una squadra per iscriverti al torneo.
              </Text>
              <TouchableOpacity
                style={ts.createTeamBtn}
                onPress={() => navigation.navigate('CreateTeam')}
                activeOpacity={0.85}
              >
                <Text style={ts.createTeamBtnText}>Crea una squadra</Text>
              </TouchableOpacity>
            </View>
          ) : (
            teams.map((team) => (
              <TeamCard
                key={team.id}
                team={team}
                selected={selectedId === team.id}
                onPress={() => setSelectedId(team.id)}
              />
            ))
          )}
        </ScrollView>

        {/* Bottom bar */}
        <View style={[ts.bottomBar, { paddingBottom: insets.bottom + 12 }]}>
          <TouchableOpacity
            style={[ts.ctaBtn, !selectedId && ts.ctaBtnDisabled]}
            onPress={handleContinue}
            activeOpacity={0.85}
            disabled={!selectedId}
          >
            <Text style={ts.ctaBtnText}>
              {selectedTeam ? `Continua con ${selectedTeam.name}` : 'Seleziona una squadra'}
            </Text>
            {selectedTeam && <Ionicons name="arrow-forward" size={16} color="#fff" />}
          </TouchableOpacity>
        </View>

      </SafeAreaView>
    </View>
  );
}

const ts = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#f8fafc' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '800',
    color: '#1e293b',
    textAlign: 'center',
  },

  subtitle: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    paddingHorizontal: 32,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },

  scrollContent: { padding: 16, gap: 10 },

  teamCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  teamCardSelected: { borderColor: '#E8601A', backgroundColor: '#FFFBF8' },

  teamAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
  },
  teamAvatarText: { color: '#fff', fontSize: 16, fontWeight: '800' },

  teamName: { fontSize: 14, fontWeight: '700', color: '#1e293b' },
  teamMeta: { fontSize: 12, color: '#64748b', marginTop: 2 },

  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: { backgroundColor: '#E8601A', borderColor: '#E8601A' },
  radioDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#fff' },

  emptyBox: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
    gap: 12,
  },
  emptyText: { fontSize: 16, fontWeight: '800', color: '#94a3b8', textAlign: 'center' },
  emptySubText: { fontSize: 13, color: '#cbd5e1', textAlign: 'center', lineHeight: 20 },

  createTeamBtn: {
    marginTop: 4,
    backgroundColor: '#E8601A',
    borderRadius: 50,
    paddingVertical: 13,
    paddingHorizontal: 28,
  },
  createTeamBtnText: { color: '#fff', fontSize: 14, fontWeight: '800' },

  bottomBar: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 10,
  },
  ctaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#E8601A',
    borderRadius: 50,
    paddingVertical: 13,
    paddingHorizontal: 20,
  },
  ctaBtnDisabled: { backgroundColor: '#e2e8f0' },
  ctaBtnText: { color: '#fff', fontSize: 14, fontWeight: '800' },
});
