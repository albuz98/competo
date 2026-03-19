import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { Team, AppUser, PendingInvite, TeamRole } from '../types';
import { useAuth } from './AuthContext';
import {
  fetchUserTeams,
  createTeam as apiCreateTeam,
  inviteMember as apiInviteMember,
  removeMember as removeMemberAPI,
  getPendingInvites as getPendingInvitesAPI,
  acceptInvite as apiAcceptInvite,
  rejectInvite as apiRejectInvite,
  updateMemberRole as updateMemberRoleAPI,
} from '../api/teams';

interface TeamsContextType {
  teams: Team[];
  loading: boolean;
  pendingReceivedInvites: PendingInvite[];
  sentPendingInvites: PendingInvite[];
  createTeam: (name: string, sport: string) => Promise<Team>;
  addMember: (teamId: string, appUser: AppUser) => Promise<void>;
  removeMember: (teamId: string, memberId: string) => Promise<void>;
  acceptInvite: (inviteId: string) => Promise<void>;
  rejectInvite: (inviteId: string) => Promise<void>;
  updateMemberRole: (teamId: string, memberId: string, newRole: TeamRole) => Promise<void>;
  getTeamById: (id: string) => Team | undefined;
  refreshTeams: () => Promise<void>;
}

const TeamsContext = createContext<TeamsContextType | null>(null);

export function TeamsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(false);
  const [pendingReceivedInvites, setPendingReceivedInvites] = useState<PendingInvite[]>([]);
  const [sentPendingInvites, setSentPendingInvites] = useState<PendingInvite[]>([]);

  const loadTeams = useCallback(async () => {
    if (!user) {
      setTeams([]);
      return;
    }
    setLoading(true);
    try {
      const data = await fetchUserTeams(user.token);
      setTeams(data);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const loadPendingInvites = useCallback(async () => {
    if (!user) {
      setPendingReceivedInvites([]);
      return;
    }
    const invites = await getPendingInvitesAPI(user.id, user.token);
    setPendingReceivedInvites(invites);
  }, [user]);

  useEffect(() => {
    loadTeams();
    loadPendingInvites();
  }, [user?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const createTeam = async (name: string, sport: string): Promise<Team> => {
    const representative = user
      ? { id: user.id, firstName: user.firstName, lastName: user.lastName, username: user.username }
      : undefined;
    const team = await apiCreateTeam(name, sport, user?.token ?? '', representative);
    setTeams((prev) => [...prev, team]);
    return team;
  };

  const addMember = async (teamId: string, appUser: AppUser): Promise<void> => {
    await apiInviteMember(teamId, appUser, user?.token ?? '');
    const team = teams.find(t => t.id === teamId);
    const newInvite: PendingInvite = {
      id: `invite-${Date.now()}-${appUser.id}`,
      teamId,
      teamName: team?.name ?? '',
      sport: team?.sport ?? '',
      fromUserId: user?.id ?? '',
      fromFirstName: user?.firstName ?? '',
      fromLastName: user?.lastName ?? '',
      toUserId: appUser.id,
      createdAt: new Date().toISOString(),
    };
    setSentPendingInvites(prev => [...prev, newInvite]);
  };

  const removeMember = useCallback(async (teamId: string, memberId: string) => {
    if (!user) return;
    // Optimistic update
    setTeams(prev =>
      prev.map(t =>
        t.id === teamId
          ? { ...t, members: t.members.filter(m => m.id !== memberId) }
          : t
      )
    );
    try {
      await removeMemberAPI(teamId, memberId, user.token);
    } catch (e) {
      // Revert on error - refresh from API
      await loadTeams();
      throw e;
    }
  }, [user, loadTeams]);

  const acceptInvite = useCallback(async (inviteId: string) => {
    if (!user) return;
    await apiAcceptInvite(inviteId, { id: user.id, firstName: user.firstName, lastName: user.lastName, username: user.username }, user.token);
    setPendingReceivedInvites(prev => prev.filter(i => i.id !== inviteId));
    await loadTeams();
  }, [user, loadTeams]);

  const rejectInvite = useCallback(async (inviteId: string) => {
    if (!user) return;
    await apiRejectInvite(inviteId, user.token);
    setPendingReceivedInvites(prev => prev.filter(i => i.id !== inviteId));
  }, [user]);

  const updateMemberRole = useCallback(async (teamId: string, memberId: string, newRole: TeamRole) => {
    if (!user) return;
    setTeams(prev =>
      prev.map(t =>
        t.id === teamId
          ? { ...t, members: t.members.map(m => m.id === memberId ? { ...m, role: newRole } : m) }
          : t
      )
    );
    try {
      await updateMemberRoleAPI(teamId, memberId, newRole, user.token);
    } catch (e) {
      await loadTeams();
      throw e;
    }
  }, [user, loadTeams]);

  const getTeamById = (id: string) => teams.find((t) => t.id === id);

  return (
    <TeamsContext.Provider value={{
      teams,
      loading,
      pendingReceivedInvites,
      sentPendingInvites,
      createTeam,
      addMember,
      removeMember,
      acceptInvite,
      rejectInvite,
      updateMemberRole,
      getTeamById,
      refreshTeams: loadTeams,
    }}>
      {children}
    </TeamsContext.Provider>
  );
}

export function useTeams() {
  const ctx = useContext(TeamsContext);
  if (!ctx) throw new Error('useTeams must be used within TeamsProvider');
  return ctx;
}
