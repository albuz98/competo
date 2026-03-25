import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { ts } from '../styles/TeamSelectScreen.styles';
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

