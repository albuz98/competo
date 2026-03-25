import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { tss } from '../styles/TeamsScreen.styles';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList, Team, PendingInvite } from '../types';
import { useTeams } from '../context/TeamsContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Teams'>;

function TeamCard({ team, onPress }: { team: Team; onPress: () => void }) {
  const initials = team.name.slice(0, 2).toUpperCase();
  const representative = team.members.find((m) => m.role === 'representative');
  return (
    <TouchableOpacity style={tss.teamCard} onPress={onPress} activeOpacity={0.85}>
      <LinearGradient colors={['#E8601A', '#F5A020']} style={tss.teamAvatar}>
        <Text style={tss.teamAvatarText}>{initials}</Text>
      </LinearGradient>
      <View style={{ flex: 1 }}>
        <Text style={tss.teamName} numberOfLines={1}>{team.name}</Text>
        <Text style={tss.teamMeta}>
          {team.sport} · {team.members.length} giocatori
        </Text>
        {representative && (
          <Text style={tss.teamRep} numberOfLines={1}>
            Cap. {representative.firstName} {representative.lastName}
          </Text>
        )}
      </View>
      <Ionicons name="chevron-forward" size={18} color="#cbd5e1" />
    </TouchableOpacity>
  );
}

function InviteCard({
  invite,
  onAccept,
  onReject,
}: {
  invite: PendingInvite;
  onAccept: () => void;
  onReject: () => void;
}) {
  const initials = invite.teamName.slice(0, 2).toUpperCase();
  return (
    <View style={tss.inviteCard}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 }}>
        <LinearGradient colors={['#E8601A', '#F5A020']} style={tss.inviteCardAvatar}>
          <Text style={tss.inviteCardAvatarText}>{initials}</Text>
        </LinearGradient>
        <View style={tss.inviteCardInfo}>
          <Text style={tss.inviteTeamName}>{invite.teamName}</Text>
          <Text style={tss.inviteCardFrom}>
            {invite.sport}
          </Text>
          <Text style={tss.inviteCardFrom}>
            Invitato da {invite.fromFirstName} {invite.fromLastName}
          </Text>
        </View>
      </View>
      <View style={tss.inviteCardActions}>
        <TouchableOpacity style={tss.inviteAcceptBtn} onPress={onAccept} activeOpacity={0.85}>
          <Text style={tss.inviteAcceptText}>Accetta</Text>
        </TouchableOpacity>
        <TouchableOpacity style={tss.inviteRejectBtn} onPress={onReject} activeOpacity={0.85}>
          <Text style={tss.inviteRejectText}>Rifiuta</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function TeamsScreen({ navigation }: Props) {
  const { teams, loading, pendingReceivedInvites, acceptInvite, rejectInvite } = useTeams();
  const insets = useSafeAreaInsets();

  const handleAcceptInvite = async (inviteId: string) => {
    try {
      await acceptInvite(inviteId);
    } catch {
      Alert.alert('Errore', 'Impossibile accettare l\'invito. Riprova.');
    }
  };

  const handleRejectInvite = async (inviteId: string) => {
    try {
      await rejectInvite(inviteId);
    } catch {
      Alert.alert('Errore', 'Impossibile rifiutare l\'invito. Riprova.');
    }
  };

  return (
    <View style={tss.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>

        {/* Header */}
        <View style={tss.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={tss.backBtn} activeOpacity={0.7}>
            <Ionicons name="chevron-back" size={24} color="#1e293b" />
          </TouchableOpacity>
          <Text style={tss.headerTitle}>Le mie squadre</Text>
          <TouchableOpacity
            style={tss.addBtn}
            onPress={() => navigation.navigate('CreateTeam')}
            activeOpacity={0.8}
          >
            <LinearGradient colors={['#E8601A', '#F5A020']} style={tss.addBtnGrad}>
              <Ionicons name="add" size={20} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={tss.centerBox}>
            <ActivityIndicator color="#E8601A" />
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={[tss.scrollContent, { paddingBottom: insets.bottom + 20 }]}
            showsVerticalScrollIndicator={false}
          >
            {/* Pending received invites section */}
            {pendingReceivedInvites.length > 0 && (
              <View style={tss.invitesSection}>
                <Text style={tss.invitesSectionTitle}>INVITI IN SOSPESO</Text>
                {pendingReceivedInvites.map(invite => (
                  <InviteCard
                    key={invite.id}
                    invite={invite}
                    onAccept={() => handleAcceptInvite(invite.id)}
                    onReject={() => handleRejectInvite(invite.id)}
                  />
                ))}
              </View>
            )}

            {teams.length === 0 && pendingReceivedInvites.length === 0 ? (
              <View style={tss.emptyBox}>
                <View style={tss.emptyIcon}>
                  <Ionicons name="people-outline" size={48} color="#e2e8f0" />
                </View>
                <Text style={tss.emptyTitle}>Nessuna squadra</Text>
                <Text style={tss.emptySub}>Crea la tua prima squadra e invita i tuoi amici a giocare insieme.</Text>
                <TouchableOpacity
                  style={tss.createBtn}
                  onPress={() => navigation.navigate('CreateTeam')}
                  activeOpacity={0.85}
                >
                  <Text style={tss.createBtnText}>Crea squadra</Text>
                </TouchableOpacity>
              </View>
            ) : (
              teams.map((t) => (
                <TeamCard
                  key={t.id}
                  team={t}
                  onPress={() => navigation.navigate('TeamDetail', { teamId: t.id })}
                />
              ))
            )}
          </ScrollView>
        )}

      </SafeAreaView>
    </View>
  );
}

