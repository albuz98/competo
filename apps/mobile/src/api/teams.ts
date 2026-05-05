import { TeamRole } from "../constants/team";
import {
  generateTeamMember,
  getMockPendingInvites,
  getMockTeamCache,
  getMockUsersCache,
  mockTeamCache,
} from "../mock/team";
import { Team, AppUser, PendingInvite } from "../types/team";
import { apiFetch } from "./config";
import { mockFlags } from "./mockFlags";
import { faker } from "@faker-js/faker";

export async function fetchUserTeams(token: string): Promise<Team[]> {
  if (mockFlags.IS_MOCKING_FETCH_USER_TEAMS) {
    await new Promise((r) => setTimeout(r, 400));
    return [...getMockTeamCache()]; // shallow copy — prevents cache mutations from aliasing React state
  }
  return apiFetch<Team[]>("/teams/mine", {}, token);
}

export async function getPendingInvites(
  userId: number,
  token: string,
): Promise<PendingInvite[]> {
  if (mockFlags.IS_MOCKING_GET_PENDING_INVITES) {
    await new Promise((r) => setTimeout(r, 300));
    return getMockPendingInvites().filter((i) => i.toUserId === userId);
  }
  return apiFetch<PendingInvite[]>("/teams/invites/pending", {}, token);
}

export async function updateMemberRole(
  teamId: number,
  memberId: number,
  newRole: TeamRole,
  token: string,
): Promise<void> {
  if (mockFlags.IS_MOCKING_UPDATE_MEMBER_ROLE) {
    await new Promise((r) => setTimeout(r, 300));
    const team = getMockTeamCache().find((t) => t.id === teamId);
    if (!team) throw new Error("Squadra non trovata");
    const member = team.members.find((m) => m.id === memberId);
    if (!member) throw new Error("Membro non trovato");
    if (member.role === TeamRole.REPRESENTATIVE)
      throw new Error("Non puoi cambiare il ruolo del rappresentante");
    if (newRole === TeamRole.COACH) {
      const existing = team.members.find(
        (m) => m.role === TeamRole.COACH && m.id !== memberId,
      );
      if (existing) throw new Error("La squadra ha già un allenatore");
    }
    if (newRole === TeamRole.GOLKEEPER) {
      const existing = team.members.find(
        (m) => m.role === TeamRole.GOLKEEPER && m.id !== memberId,
      );
      if (existing) throw new Error("La squadra ha già un portiere");
    }
    member.role = newRole;
    return;
  }
  return apiFetch<void>(
    `/teams/${encodeURIComponent(teamId)}/members/${encodeURIComponent(memberId)}/role`,
    { method: "PATCH", body: JSON.stringify({ role: newRole }) },
    token,
  );
}

export async function updateTeam(
  teamId: number,
  updates: { name?: string; logoUrl?: string },
  token: string,
): Promise<void> {
  if (mockFlags.IS_MOCKING_UPDATE_TEAM) {
    await new Promise<void>((res) => setTimeout(res, 300));
    const team = getMockTeamCache().find((t) => t.id === teamId);
    if (!team) throw new Error("Squadra non trovata");
    if (updates.name !== undefined) team.name = updates.name;
    if (updates.logoUrl !== undefined) team.logoUrl = updates.logoUrl;
    return;
  }
  return apiFetch<void>(
    `/teams/${encodeURIComponent(teamId)}`,
    { method: "PATCH", body: JSON.stringify(updates) },
    token,
  );
}

//--------------------- IT'S OK ------------------------------
export async function leaveTeam(
  teamId: number,
  userId: number,
  token: string,
): Promise<void> {
  if (mockFlags.IS_MOCKING_LEAVE_TEAM) {
    await new Promise<void>((res) => setTimeout(res, 300));
    const team = getMockTeamCache().find((t) => t.id === teamId);
    if (!team) throw new Error("Squadra non trovata");
    team.members = team.members.filter((m) => m.id !== userId);
    return;
  }
  return apiFetch<void>(
    `/api/v1/teams/${encodeURIComponent(teamId)}/members/${userId}`,
    { method: "POST" },
    token,
  );
}

export async function deleteTeam(teamId: number, token: string): Promise<void> {
  if (mockFlags.IS_MOCKING_DELETE_TEAM) {
    await new Promise<void>((res) => setTimeout(res, 300));
    const idx = getMockTeamCache().findIndex((t) => t.id === teamId);
    if (idx === -1) throw new Error("Squadra non trovata");
    getMockTeamCache().splice(idx, 1);
    return;
  }
  return apiFetch<void>(
    `/api/v1/teams/${encodeURIComponent(teamId)}`,
    { method: "DELETE" },
    token,
  );
}

export async function createTeam(
  name: string,
  sport: string,
  format: string,
  representative_role: string,
  token: string,
  representative?: {
    id: number;
    firstName: string;
    lastName: string;
    username: string;
    city: string;
  },
): Promise<Team> {
  if (mockFlags.IS_MOCKING_CREATE_TEAM) {
    // Duplicate name check: same representative can't have two teams with same name
    if (mockTeamCache && representative) {
      const duplicate = mockTeamCache.find(
        (t) =>
          t.name.trim().toLowerCase() === name.trim().toLowerCase() &&
          t.members.some(
            (m) => m.id === representative.id && m.role === "representative",
          ),
      );
      if (duplicate) {
        throw new Error("Hai già una squadra con questo nome");
      }
    }
    await new Promise((r) => setTimeout(r, 400));
    const rep = representative
      ? { ...representative, role: TeamRole.REPRESENTATIVE }
      : generateTeamMember(TeamRole.REPRESENTATIVE);
    const newTeam: Team = {
      id: faker.number.int(),
      name,
      sport,
      members: [rep],
      createdAt: new Date().toISOString(),
    };
    getMockTeamCache().push(newTeam);
    return newTeam;
  }
  return apiFetch<Team>(
    "/api/v1/teams",
    {
      method: "POST",
      body: JSON.stringify({
        name: name.trim(),
        sport,
        format,
        city: representative?.city,
        representative_role,
      }),
    },
    token,
  );
}

export async function inviteMember(
  teamId: number,
  appUser: AppUser,
  token: string,
): Promise<void> {
  if (mockFlags.IS_MOCKING_INVITE_MEMBER) {
    // Mock path: create pending invite, do NOT add to team.members
    const team = getMockTeamCache().find((t) => t.id === teamId);
    if (!team) return;
    if (team.members.find((m) => m.id === appUser.id)) return; // already member
    if (
      getMockPendingInvites().find(
        (i) => i.teamId === teamId && i.toUserId === appUser.id,
      )
    )
      return; // already invited
    const rep = team.members.find((m) => m.role === "representative");
    getMockPendingInvites().push({
      id: appUser.id,
      teamId: team.id,
      teamName: team.name,
      sport: team.sport,
      fromUserId: rep?.id ?? 0,
      fromFirstName: rep?.firstName ?? "",
      fromLastName: rep?.lastName ?? "",
      toUserId: appUser.id,
      createdAt: new Date().toISOString(),
    });
    return;
  }
  return apiFetch<void>(
    `/api/v1/teams/${teamId}/invitations`,
    {
      method: "POST",
      body: JSON.stringify({
        invited_user_id: appUser.id,
        role: TeamRole.PLAYER,
      }),
    },
    token,
  );
}

export async function removeMember(
  teamId: number,
  memberId: number,
  token: string,
): Promise<void> {
  if (mockFlags.IS_MOCKING_REMOVE_MEMBER) {
    await new Promise<void>((res) => setTimeout(res, 300));
    const team = getMockTeamCache().find((t) => t.id === teamId);
    if (!team) throw new Error("Squadra non trovata");
    const member = team.members.find((m) => m.id === memberId);
    if (!member) throw new Error("Membro non trovato");
    if (member.role === "representative")
      throw new Error("Non puoi rimuovere il rappresentante");
    team.members = team.members.filter((m) => m.id !== memberId);
    return;
  }
  return apiFetch<void>(
    `/api/v1/teams/${encodeURIComponent(teamId)}/members/${encodeURIComponent(memberId)}`,
    { method: "DELETE" },
    token,
  );
}

export async function searchUsers(
  query: string,
  token: string,
): Promise<AppUser[]> {
  if (mockFlags.IS_MOCKING_SEARCH_USERS) {
    await new Promise((r) => setTimeout(r, 250));
    const all = getMockUsersCache();
    if (!query.trim()) return all.slice(0, 10);
    const q = query.toLowerCase();
    return all.filter(
      (u) =>
        u.username.toLowerCase().includes(q) ||
        (u.firstName && u.firstName.toLowerCase().includes(q)) ||
        (u.lastName && u.lastName.toLowerCase().includes(q)),
    );
  }
  const res = await apiFetch<{
    data: {
      id: number;
      username: string;
      first_name: string;
      last_name: string;
    }[];
    pagination: Record<string, unknown>;
  }>(`/api/v1/users/search?q=${encodeURIComponent(query)}`, {}, token);
  return res.data.map((u) => ({
    id: u.id,
    username: u.username,
    firstName: u.first_name,
    lastName: u.last_name,
  }));
}

export async function acceptInvite(
  inviteId: number,
  currentUser: {
    id: number;
    firstName: string;
    lastName: string;
    username: string;
  },
  token: string,
): Promise<void> {
  if (mockFlags.IS_MOCKING_ACCEPT_INVITE) {
    await new Promise((r) => setTimeout(r, 400));
    const invites = getMockPendingInvites();
    const invite = invites.find((i) => i.id === inviteId);
    if (!invite) throw new Error("Invito non trovato");
    // Add user to the team (create it in cache if external team doesn't exist)
    let team = getMockTeamCache().find((t) => t.id === invite.teamId);
    if (!team) {
      team = {
        id: invite.teamId,
        name: invite.teamName,
        sport: invite.sport,
        members: [
          {
            id: invite.fromUserId,
            firstName: invite.fromFirstName,
            lastName: invite.fromLastName,
            username: `${invite.fromFirstName.toLowerCase()}`,
            role: TeamRole.REPRESENTATIVE,
          },
        ],
        createdAt: invite.createdAt,
      };
      getMockTeamCache().push(team);
    }
    if (!team.members.find((m) => m.id === currentUser.id)) {
      team.members.push({ ...currentUser, role: TeamRole.PLAYER });
    }
    invites.filter((i) => i.id !== inviteId);
    return;
  }
  return apiFetch<void>(
    `/api/v1/teams/invitations/${encodeURIComponent(inviteId)}/accept`,
    { method: "POST" },
    token,
  );
}

export async function declineInvite(
  inviteId: number,
  token: string,
): Promise<void> {
  if (mockFlags.IS_MOCKING_REJECT_INVITE) {
    await new Promise((r) => setTimeout(r, 300));
    getMockPendingInvites().filter((i) => i.id !== inviteId);
    return;
  }
  return apiFetch<void>(
    `/api/v1/teams/invitations/${encodeURIComponent(inviteId)}/decline`,
    { method: "POST" },
    token,
  );
}
