import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./AuthContext";
import {
  fetchUserTeams,
  createTeam as apiCreateTeam,
  inviteMember as apiInviteMember,
  removeMember as removeMemberAPI,
  getPendingInvites as getPendingInvitesAPI,
  acceptInvite as apiAcceptInvite,
  declineInvite as apiRejectInvite,
  updateMemberRole as updateMemberRoleAPI,
  deleteTeam as apiDeleteTeam,
  leaveTeam as apiLeaveTeam,
} from "../api/teams";
import { TeamRole } from "../constants/team";
import { Team, PendingInvite, AppUser } from "../types/team";
import { queryKeys } from "../lib/queryKeys";

interface TeamsContextType {
  teams: Team[];
  loading: boolean;
  pendingReceivedInvites: PendingInvite[];
  sentPendingInvites: PendingInvite[];
  createTeam: (name: string, sport: string) => Promise<Team>;
  addMember: (teamId: number, appUser: AppUser) => Promise<void>;
  removeMember: (teamId: number, memberId: number) => Promise<void>;
  acceptInvite: (inviteId: number) => Promise<void>;
  declineInvite: (inviteId: number) => Promise<void>;
  updateMemberRole: (
    teamId: number,
    memberId: number,
    newRole: TeamRole,
  ) => Promise<void>;
  updateMemberJersey: (
    teamId: number,
    memberId: number,
    jerseyNumber: number | undefined,
  ) => void;
  deleteTeam: (teamId: number) => Promise<void>;
  leaveTeam: (teamId: number) => Promise<void>;
  getTeamById: (id: number) => Team | undefined;
  refreshTeams: () => Promise<void>;
}

const TeamsContext = createContext<TeamsContextType | null>(null);

export function TeamsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const qc = useQueryClient();

  // ─── Local-only state (not persisted to server) ───────────────────────────
  // Tracks invites sent in this session for optimistic UI in InvitePlayers.
  // Seeded from the server's sent-invites list when a team is selected.
  const [sentPendingInvites, setSentPendingInvites] = useState<PendingInvite[]>(
    [],
  );

  // ─── Queries ──────────────────────────────────────────────────────────────

  const { data: teams = [], isFetching: loadingTeams } = useQuery({
    queryKey: queryKeys.teams(),
    queryFn: () => fetchUserTeams(user!.token),
    enabled: !!user,
  });

  const { data: pendingReceivedInvites = [] } = useQuery({
    queryKey: queryKeys.pendingInvites(),
    queryFn: () => getPendingInvitesAPI(user!.id, user!.token),
    enabled: !!user,
  });

  // ─── Mutations ────────────────────────────────────────────────────────────

  const createTeamMutation = useMutation({
    mutationFn: ({ name, sport }: { name: string; sport: string }) => {
      const representative = user
        ? {
            id: user.id,
            firstName: user.first_name ?? "",
            lastName: user.last_name ?? "",
            username: user.username ?? "",
          }
        : { id: 0, firstName: "", lastName: "", username: "" };
      return apiCreateTeam(name, sport, user?.token ?? "", representative);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.teams() });
    },
  });

  const inviteMemberMutation = useMutation({
    mutationFn: ({ teamId, appUser }: { teamId: number; appUser: AppUser }) =>
      apiInviteMember(teamId, appUser, user?.token ?? ""),
    onSuccess: (_, { teamId, appUser }) => {
      const team = teams.find((t) => t.id === teamId);
      const newInvite: PendingInvite = {
        id: Number(appUser.id),
        teamId,
        teamName: team?.name ?? "",
        sport: team?.sport ?? "",
        fromUserId: user?.id ?? 0,
        fromFirstName: user?.first_name ?? "",
        fromLastName: user?.last_name ?? "",
        toUserId: appUser.id,
        createdAt: new Date().toISOString(),
      };
      setSentPendingInvites((prev) => [...prev, newInvite]);
    },
  });

  const removeMemberMutation = useMutation({
    mutationFn: ({
      teamId,
      memberId,
    }: {
      teamId: number;
      memberId: number;
    }) => {
      if (!user) return Promise.reject(new Error("Not authenticated"));
      return removeMemberAPI(teamId, memberId, user.token);
    },
    // Optimistic update
    onMutate: async ({ teamId, memberId }) => {
      await qc.cancelQueries({ queryKey: queryKeys.teams() });
      const prev = qc.getQueryData<Team[]>(queryKeys.teams());
      qc.setQueryData<Team[]>(queryKeys.teams(), (old = []) =>
        old.map((t) =>
          t.id === teamId
            ? { ...t, members: t.members.filter((m) => m.id !== memberId) }
            : t,
        ),
      );
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(queryKeys.teams(), ctx.prev);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: queryKeys.teams() });
    },
  });

  const acceptInviteMutation = useMutation({
    mutationFn: (inviteId: number) => {
      if (!user) return Promise.reject(new Error("Not authenticated"));
      return apiAcceptInvite(
        inviteId,
        {
          id: user.id,
          firstName: user.first_name ?? "",
          lastName: user.last_name ?? "",
          username: user.username ?? "",
        },
        user.token,
      );
    },
    onSuccess: (_data, inviteId) => {
      qc.setQueryData<PendingInvite[]>(queryKeys.pendingInvites(), (old = []) =>
        old.filter((i) => i.id !== inviteId),
      );
      qc.invalidateQueries({ queryKey: queryKeys.teams() });
    },
  });

  const rejectInviteMutation = useMutation({
    mutationFn: (inviteId: number) => {
      if (!user) return Promise.reject(new Error("Not authenticated"));
      return apiRejectInvite(inviteId, user.token);
    },
    onSuccess: (_data, inviteId) => {
      qc.setQueryData<PendingInvite[]>(queryKeys.pendingInvites(), (old = []) =>
        old.filter((i) => i.id !== inviteId),
      );
    },
  });

  const updateMemberRoleMutation = useMutation({
    mutationFn: ({
      teamId,
      memberId,
      newRole,
    }: {
      teamId: number;
      memberId: number;
      newRole: TeamRole;
    }) => {
      if (!user) return Promise.reject(new Error("Not authenticated"));
      return updateMemberRoleAPI(teamId, memberId, newRole, user.token);
    },
    // Optimistic update
    onMutate: async ({ teamId, memberId, newRole }) => {
      await qc.cancelQueries({ queryKey: queryKeys.teams() });
      const prev = qc.getQueryData<Team[]>(queryKeys.teams());
      qc.setQueryData<Team[]>(queryKeys.teams(), (old = []) =>
        old.map((t) =>
          t.id === teamId
            ? {
                ...t,
                members: t.members.map((m) =>
                  m.id === memberId ? { ...m, role: newRole } : m,
                ),
              }
            : t,
        ),
      );
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(queryKeys.teams(), ctx.prev);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: queryKeys.teams() });
    },
  });

  const deleteTeamMutation = useMutation({
    mutationFn: (teamId: number) => {
      if (!user) return Promise.reject(new Error("Not authenticated"));
      return apiDeleteTeam(teamId, user.token);
    },
    onMutate: async (teamId) => {
      await qc.cancelQueries({ queryKey: queryKeys.teams() });
      const prev = qc.getQueryData<Team[]>(queryKeys.teams());
      qc.setQueryData<Team[]>(queryKeys.teams(), (old = []) =>
        old.filter((t) => t.id !== teamId),
      );
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(queryKeys.teams(), ctx.prev);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: queryKeys.teams() });
    },
  });

  const leaveTeamMutation = useMutation({
    mutationFn: (teamId: number) => {
      if (!user) return Promise.reject(new Error("Not authenticated"));
      return apiLeaveTeam(teamId, user.id, user.token);
    },
    onMutate: async (teamId) => {
      await qc.cancelQueries({ queryKey: queryKeys.teams() });
      const prev = qc.getQueryData<Team[]>(queryKeys.teams());
      qc.setQueryData<Team[]>(queryKeys.teams(), (old = []) =>
        old.filter((t) => t.id !== teamId),
      );
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(queryKeys.teams(), ctx.prev);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: queryKeys.teams() });
    },
  });

  // ─── Public API ───────────────────────────────────────────────────────────

  const createTeam = async (name: string, sport: string): Promise<Team> => {
    return createTeamMutation.mutateAsync({ name, sport });
  };

  const addMember = async (teamId: number, appUser: AppUser): Promise<void> => {
    return inviteMemberMutation.mutateAsync({ teamId, appUser });
  };

  const removeMember = async (
    teamId: number,
    memberId: number,
  ): Promise<void> => {
    return removeMemberMutation.mutateAsync({ teamId, memberId });
  };

  const acceptInvite = async (inviteId: number): Promise<void> => {
    return acceptInviteMutation.mutateAsync(inviteId);
  };

  const declineInvite = async (inviteId: number): Promise<void> => {
    return rejectInviteMutation.mutateAsync(inviteId);
  };

  const updateMemberRole = async (
    teamId: number,
    memberId: number,
    newRole: TeamRole,
  ): Promise<void> => {
    return updateMemberRoleMutation.mutateAsync({ teamId, memberId, newRole });
  };

  // Jersey number is a local-only UI state — no API endpoint exists yet.
  const updateMemberJersey = (
    teamId: number,
    memberId: number,
    jerseyNumber: number | undefined,
  ) => {
    qc.setQueryData<Team[]>(queryKeys.teams(), (old = []) =>
      old.map((t) =>
        t.id === teamId
          ? {
              ...t,
              members: t.members.map((m) =>
                m.id === memberId ? { ...m, jerseyNumber } : m,
              ),
            }
          : t,
      ),
    );
  };

  const deleteTeam = async (teamId: number): Promise<void> => {
    return deleteTeamMutation.mutateAsync(teamId);
  };

  const leaveTeam = async (teamId: number): Promise<void> => {
    return leaveTeamMutation.mutateAsync(teamId);
  };

  const getTeamById = (id: number) => teams.find((t) => t.id === id);

  const refreshTeams = async () => {
    await qc.invalidateQueries({ queryKey: queryKeys.teams() });
  };

  const loading = loadingTeams;

  return (
    <TeamsContext.Provider
      value={{
        teams,
        loading,
        pendingReceivedInvites,
        sentPendingInvites,
        createTeam,
        addMember,
        removeMember,
        acceptInvite,
        declineInvite,
        updateMemberRole,
        updateMemberJersey,
        deleteTeam,
        leaveTeam,
        getTeamById,
        refreshTeams,
      }}
    >
      {children}
    </TeamsContext.Provider>
  );
}

export function useTeams() {
  const ctx = useContext(TeamsContext);
  if (!ctx) throw new Error("useTeams must be used within TeamsProvider");
  return ctx;
}
