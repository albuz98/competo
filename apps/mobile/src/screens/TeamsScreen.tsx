import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
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

const tss = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#f8fafc' },
  centerBox: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, fontSize: 18, fontWeight: '800', color: '#1e293b', paddingLeft: 4 },
  addBtn: {},
  addBtnGrad: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  scrollContent: { padding: 16, gap: 12 },

  teamCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  teamAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  teamAvatarText: { color: '#fff', fontSize: 18, fontWeight: '800' },
  teamName: { fontSize: 15, fontWeight: '700', color: '#1e293b' },
  teamMeta: { fontSize: 12, color: '#64748b', marginTop: 2 },
  teamRep: { fontSize: 11, color: '#94a3b8', marginTop: 2 },

  emptyBox: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptyIcon: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#94a3b8' },
  emptySub: { fontSize: 13, color: '#cbd5e1', textAlign: 'center', marginTop: 8, lineHeight: 20 },
  createBtn: {
    marginTop: 24,
    backgroundColor: '#E8601A',
    borderRadius: 50,
    paddingVertical: 14,
    paddingHorizontal: 40,
  },
  createBtnText: { color: '#fff', fontSize: 15, fontWeight: '800' },

  // Invites section
  invitesSection: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: 4,
  },
  invitesSectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  inviteCard: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f8fafc',
  },
  inviteCardAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inviteCardAvatarText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  inviteCardInfo: { flex: 1 },
  inviteTeamName: { fontSize: 15, fontWeight: '700', color: '#1e293b' },
  inviteCardFrom: { fontSize: 12, color: '#94a3b8', marginTop: 2 },
  inviteCardActions: {
    flexDirection: 'row',
    gap: 10,
  },
  inviteAcceptBtn: {
    flex: 1,
    backgroundColor: '#10b981',
    borderRadius: 50,
    paddingVertical: 10,
    alignItems: 'center',
  },
  inviteAcceptText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  inviteRejectBtn: {
    flex: 1,
    borderRadius: 50,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#ef4444',
  },
  inviteRejectText: { color: '#ef4444', fontSize: 13, fontWeight: '700' },
});
