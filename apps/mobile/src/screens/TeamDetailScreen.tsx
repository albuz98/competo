import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Modal,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList, TeamMember, TeamRole } from '../types';
import { useTeams } from '../context/TeamsContext';
import { useAuth } from '../context/AuthContext';

type Props = NativeStackScreenProps<RootStackParamList, 'TeamDetail'>;

const ROLE_LABEL: Record<string, string> = {
  representative: 'Rappresentante',
  calciatore: 'Calciatore',
  allenatore: 'Allenatore',
  portiere: 'Portiere',
};

function MemberRow({
  member,
  currentUserIsRep,
  onRemove,
  onChangeRole,
}: {
  member: TeamMember;
  currentUserIsRep: boolean;
  onRemove: () => void;
  onChangeRole: () => void;
}) {
  const initials =
    (member.firstName[0] ?? '') + (member.lastName[0] ?? '');
  const isRep = member.role === 'representative';
  return (
    <View style={[tds.memberRow, isRep && tds.memberRowRep]}>
      <View style={[tds.memberAvatar, isRep && tds.memberAvatarRep]}>
        {isRep ? (
          <LinearGradient colors={['#E8601A', '#F5A020']} style={tds.memberAvatarInner}>
            <Text style={tds.memberAvatarText}>{initials.toUpperCase()}</Text>
          </LinearGradient>
        ) : (
          <View style={[tds.memberAvatarInner, { backgroundColor: '#f1f5f9' }]}>
            <Text style={[tds.memberAvatarText, { color: '#64748b' }]}>{initials.toUpperCase()}</Text>
          </View>
        )}
      </View>
      <View style={{ flex: 1 }}>
        <View style={tds.memberNameRow}>
          <Text style={tds.memberName}>{member.firstName} {member.lastName}</Text>
          {isRep && (
            <View style={tds.crownBadge}>
              <Ionicons name="star" size={10} color="#E8601A" />
              <Text style={tds.crownText}>Cap.</Text>
            </View>
          )}
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 }}>
          <Text style={tds.memberUsername}>@{member.username}</Text>
          {!isRep && (
            currentUserIsRep ? (
              <TouchableOpacity onPress={onChangeRole} style={tds.rolePill} activeOpacity={0.7}>
                <Text style={tds.rolePillText}>{ROLE_LABEL[member.role] ?? member.role}</Text>
                <Ionicons name="chevron-down" size={10} color="#64748b" />
              </TouchableOpacity>
            ) : (
              <View style={tds.rolePillStatic}>
                <Text style={tds.rolePillText}>{ROLE_LABEL[member.role] ?? member.role}</Text>
              </View>
            )
          )}
        </View>
      </View>
      {currentUserIsRep && !isRep ? (
        <TouchableOpacity onPress={onRemove} activeOpacity={0.7} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons name="person-remove-outline" size={18} color="#ef4444" />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

export default function TeamDetailScreen({ route, navigation }: Props) {
  const { teamId } = route.params;
  const { getTeamById, removeMember, sentPendingInvites, updateMemberRole } = useTeams() as any;
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const team = getTeamById(teamId);
  const [confirmTarget, setConfirmTarget] = useState<TeamMember | null>(null);
  const [roleTarget, setRoleTarget] = useState<TeamMember | null>(null);

  const isRep = team?.members.find((m: TeamMember) => m.id === user?.id)?.role === 'representative';

  const handleRemoveMember = async (memberId: string) => {
    try {
      await removeMember(teamId, memberId);
    } catch {
      console.error('Impossibile rimuovere il membro. Riprova.');
    }
  };

  const handleChangeRole = async (memberId: string, newRole: TeamRole) => {
    try {
      await updateMemberRole(teamId, memberId, newRole);
    } catch (e: any) {
      // Error is swallowed — the optimistic update will revert automatically
      console.error(e?.message);
    }
    setRoleTarget(null);
  };

  if (!team) {
    return (
      <SafeAreaView style={tds.root} edges={['top']}>
        <View style={tds.centerBox}>
          <Text style={{ color: '#ef4444' }}>Squadra non trovata</Text>
        </View>
      </SafeAreaView>
    );
  }

  const initials = team.name.slice(0, 2).toUpperCase();
  const sortedMembers = [...team.members].sort((a: TeamMember, b: TeamMember) =>
    a.role === 'representative' ? -1 : b.role === 'representative' ? 1 : 0,
  );

  return (
    <View style={tds.root}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header gradient */}
        <LinearGradient colors={['#E8601A', '#F5A020']} style={tds.header}>
          <SafeAreaView edges={['top']}>
            <View style={tds.headerTop}>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={tds.backBtn}
                activeOpacity={0.7}
              >
                <Ionicons name="arrow-back" size={22} color="#fff" />
              </TouchableOpacity>
            </View>
            <View style={tds.headerBody}>
              <View style={tds.teamAvatarLarge}>
                <Text style={tds.teamAvatarLargeText}>{initials}</Text>
              </View>
              <Text style={tds.teamName}>{team.name}</Text>
              <View style={tds.sportChip}>
                <Ionicons name="shield-checkmark" size={12} color="#fff" />
                <Text style={tds.sportChipText}>{team.sport}</Text>
              </View>
              <Text style={tds.membersCount}>{team.members.length} giocatori</Text>
            </View>
          </SafeAreaView>
        </LinearGradient>

        {/* Members list */}
        <View style={tds.section}>
          <Text style={tds.sectionTitle}>Giocatori</Text>
          {sortedMembers.map((m: TeamMember) => (
            <MemberRow
              key={m.id}
              member={m}
              currentUserIsRep={isRep}
              onRemove={() => setConfirmTarget(m)}
              onChangeRole={() => setRoleTarget(m)}
            />
          ))}
        </View>

        {/* Pending sent invites — only visible to representative */}
        {isRep && (() => {
          const sentForThisTeam = (sentPendingInvites as any[]).filter((i: any) => i.teamId === teamId);
          if (sentForThisTeam.length === 0) return null;
          return (
            <View style={[tds.section, { marginTop: 12 }]}>
              <Text style={tds.sectionTitle}>INVITI IN ATTESA</Text>
              {sentForThisTeam.map((invite: any) => (
                <View key={invite.id} style={tds.pendingInviteRow}>
                  <View style={tds.pendingInviteAvatar}>
                    <Text style={tds.pendingInviteAvatarText}>?</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={tds.pendingInviteName}>Invito inviato</Text>
                    <Text style={tds.pendingInviteSub}>In attesa di conferma</Text>
                  </View>
                  <View style={tds.pendingBadge}>
                    <Text style={tds.pendingBadgeText}>In attesa</Text>
                  </View>
                </View>
              ))}
            </View>
          );
        })()}

        {/* Invite button — only visible to the representative */}
        {isRep && (
          <TouchableOpacity
            style={tds.inviteBtn}
            onPress={() => navigation.navigate('InvitePlayers', { teamId: team.id })}
            activeOpacity={0.85}
          >
            <Ionicons name="person-add-outline" size={20} color="#E8601A" />
            <Text style={tds.inviteBtnText}>Invita giocatori</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Remove member confirmation modal */}
      <Modal
        visible={confirmTarget !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setConfirmTarget(null)}
      >
        <View style={tds.modalOverlay}>
          <View style={tds.modalCard}>
            {/* Avatar */}
            <View style={tds.modalAvatar}>
              <Text style={tds.modalAvatarText}>
                {confirmTarget
                  ? (confirmTarget.firstName[0] ?? '') + (confirmTarget.lastName[0] ?? '')
                  : ''}
              </Text>
            </View>
            <Text style={tds.modalTitle}>Rimuovi giocatore</Text>
            <Text style={tds.modalBody}>
              Vuoi rimuovere{'\n'}
              <Text style={tds.modalMemberName}>
                {confirmTarget?.firstName} {confirmTarget?.lastName}
              </Text>
              {'\n'}dalla squadra?
            </Text>
            <Text style={tds.modalWarning}>Questa azione non può essere annullata.</Text>
            <View style={tds.modalActions}>
              <TouchableOpacity
                style={tds.modalCancelBtn}
                onPress={() => setConfirmTarget(null)}
                activeOpacity={0.8}
              >
                <Text style={tds.modalCancelText}>Annulla</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={tds.modalRemoveBtn}
                onPress={() => {
                  if (confirmTarget) {
                    handleRemoveMember(confirmTarget.id);
                    setConfirmTarget(null);
                  }
                }}
                activeOpacity={0.8}
              >
                <Text style={tds.modalRemoveText}>Rimuovi</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Role picker modal */}
      <Modal
        visible={roleTarget !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setRoleTarget(null)}
      >
        <View style={tds.modalOverlay}>
          <View style={tds.modalCard}>
            <Text style={tds.modalTitle}>Cambia ruolo</Text>
            <Text style={[tds.modalBody, { marginBottom: 20 }]}>
              {roleTarget?.firstName} {roleTarget?.lastName}
            </Text>
            {(['calciatore', 'portiere', 'allenatore'] as TeamRole[]).map((role) => {
              if (role === 'representative') return null;
              const isCurrent = roleTarget?.role === role;
              const isOccupied = !isCurrent &&
                (role === 'allenatore' || role === 'portiere') &&
                team?.members.some((m: TeamMember) => m.role === role && m.id !== roleTarget?.id);
              return (
                <TouchableOpacity
                  key={role}
                  style={[
                    tds.roleOption,
                    isCurrent && tds.roleOptionCurrent,
                    isOccupied && tds.roleOptionDisabled,
                  ]}
                  onPress={() => {
                    if (!isOccupied && roleTarget) handleChangeRole(roleTarget.id, role);
                  }}
                  activeOpacity={isOccupied ? 1 : 0.7}
                >
                  <Text style={[tds.roleOptionText, isCurrent && tds.roleOptionTextCurrent, isOccupied && tds.roleOptionTextDisabled]}>
                    {ROLE_LABEL[role]}
                    {isOccupied ? ' (già presente)' : ''}
                  </Text>
                  {isCurrent && <Ionicons name="checkmark" size={18} color="#E8601A" />}
                </TouchableOpacity>
              );
            })}
            <TouchableOpacity
              style={[tds.modalCancelBtn, { marginTop: 8, width: '100%' }]}
              onPress={() => setRoleTarget(null)}
              activeOpacity={0.8}
            >
              <Text style={tds.modalCancelText}>Annulla</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const tds = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#f8fafc' },
  centerBox: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  header: { paddingBottom: 28 },
  headerTop: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(0,0,0,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerBody: { alignItems: 'center', paddingBottom: 8 },
  teamAvatarLarge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  teamAvatarLargeText: { color: '#fff', fontSize: 28, fontWeight: '900' },
  teamName: { color: '#fff', fontSize: 22, fontWeight: '800', textAlign: 'center' },
  sportChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.18)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginTop: 8,
  },
  sportChipText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  membersCount: { color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 6 },

  section: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
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

  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f8fafc',
    gap: 12,
  },
  memberRowRep: { backgroundColor: '#FFF8F5' },
  memberAvatar: {},
  memberAvatarRep: {},
  memberAvatarInner: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  memberAvatarText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  memberNameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  memberName: { fontSize: 14, fontWeight: '700', color: '#1e293b' },
  crownBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: '#FFF0E6',
    borderRadius: 20,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  crownText: { fontSize: 10, color: '#E8601A', fontWeight: '700' },
  memberUsername: { fontSize: 12, color: '#94a3b8', marginTop: 1 },
  memberRole: { fontSize: 11, color: '#cbd5e1', fontWeight: '600' },

  rolePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#f1f5f9',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  rolePillStatic: {
    backgroundColor: '#f8fafc',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  rolePillText: { fontSize: 10, color: '#64748b', fontWeight: '600' },

  roleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  roleOptionCurrent: {},
  roleOptionDisabled: { opacity: 0.4 },
  roleOptionText: { fontSize: 15, color: '#1e293b', fontWeight: '500' },
  roleOptionTextCurrent: { color: '#E8601A', fontWeight: '700' },
  roleOptionTextDisabled: {},

  pendingInviteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f8fafc',
    gap: 12,
  },
  pendingInviteAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pendingInviteAvatarText: { fontSize: 18, color: '#94a3b8' },
  pendingInviteName: { fontSize: 13, fontWeight: '600', color: '#1e293b' },
  pendingInviteSub: { fontSize: 11, color: '#94a3b8', marginTop: 1 },
  pendingBadge: {
    backgroundColor: '#fef9c3',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  pendingBadgeText: { fontSize: 11, color: '#854d0e', fontWeight: '700' },

  inviteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 16,
    marginHorizontal: 16,
    marginTop: 12,
    borderWidth: 1.5,
    borderColor: '#fed7aa',
  },
  inviteBtnText: { color: '#E8601A', fontSize: 15, fontWeight: '700' },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  modalCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 10,
  },
  modalAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#fef2f2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#fecaca',
  },
  modalAvatarText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#ef4444',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 10,
  },
  modalBody: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 6,
  },
  modalMemberName: {
    fontWeight: '700',
    color: '#1e293b',
  },
  modalWarning: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 24,
    textAlign: 'center',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalCancelBtn: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    borderRadius: 50,
    paddingVertical: 14,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#64748b',
  },
  modalRemoveBtn: {
    flex: 1,
    backgroundColor: '#ef4444',
    borderRadius: 50,
    paddingVertical: 14,
    alignItems: 'center',
  },
  modalRemoveText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
});
