import { isMocking, apiFetch } from "./config";
import { mockFlags } from "./mockFlags";
import { faker } from "@faker-js/faker";
import {
  generateTeams,
  generateTeamMember,
  generateAppUsers,
} from "../mock/data";
import type {
  Team,
  AppUser,
  PendingInvite,
  TeamRole,
} from "../types/navigation";

let mockTeamCache: Team[] | null = null;
let mockUsersCache: AppUser[] | null = null;
let pendingInviteCache: PendingInvite[] | null = null;

function getMockTeamCache(): Team[] {
  if (!mockTeamCache) {
    mockTeamCache = generateTeams(3);
  }
  return mockTeamCache;
}

function getMockUsersCache(): AppUser[] {
  if (!mockUsersCache) {
    mockUsersCache = generateAppUsers(30);
  }
  return mockUsersCache;
}

function getMockPendingInvites(): PendingInvite[] {
  if (!pendingInviteCache) {
    pendingInviteCache = [
      {
        id: "pending-invite-1",
        teamId: "external-team-1",
        teamName: "Milano United",
        sport: "Calcio",
        fromUserId: "user-ext-1",
        fromFirstName: "Marco",
        fromLastName: "Bianchi",
        toUserId: "__current__",
        createdAt: new Date(Date.now() - 7200000).toISOString(),
      },
    ];
  }
  return pendingInviteCache;
}

export async function fetchUserTeams(token: string): Promise<Team[]> {
  if (isMocking && mockFlags.IS_MOCKING_FETCH_USER_TEAMS) {
    await new Promise((r) => setTimeout(r, 400));
    return [...getMockTeamCache()]; // shallow copy — prevents cache mutations from aliasing React state
  }
  return apiFetch<Team[]>("/teams/mine", {}, token);
}

export async function createTeam(
  name: string,
  sport: string,
  token: string,
  representative?: {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
  },
): Promise<Team> {
  if (isMocking && mockFlags.IS_MOCKING_CREATE_TEAM) {
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
      ? { ...representative, role: "representative" as const }
      : generateTeamMember("representative");
    const newTeam: Team = {
      id: faker.string.uuid(),
      name,
      sport,
      members: [rep],
      createdAt: new Date().toISOString(),
    };
    getMockTeamCache().push(newTeam);
    return newTeam;
  }
  return apiFetch<Team>(
    "/teams",
    { method: "POST", body: JSON.stringify({ name, sport }) },
    token,
  );
}

export async function inviteMember(
  teamId: string,
  appUser: AppUser,
  token: string,
): Promise<void> {
  if (isMocking && mockFlags.IS_MOCKING_INVITE_MEMBER) {
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
      id: `invite-${Date.now()}-${appUser.id}`,
      teamId: team.id,
      teamName: team.name,
      sport: team.sport,
      fromUserId: rep?.id ?? "",
      fromFirstName: rep?.firstName ?? "",
      fromLastName: rep?.lastName ?? "",
      toUserId: appUser.id,
      createdAt: new Date().toISOString(),
    });
    return;
  }
  return apiFetch<void>(
    `/teams/${teamId}/invite`,
    { method: "POST", body: JSON.stringify({ userId: appUser.id }) },
    token,
  );
}

export async function removeMember(
  teamId: string,
  memberId: string,
  token: string,
): Promise<void> {
  if (isMocking && mockFlags.IS_MOCKING_REMOVE_MEMBER) {
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
    `/teams/${teamId}/members/${memberId}`,
    { method: "DELETE" },
    token,
  );
}

export async function searchUsers(
  query: string,
  token: string,
): Promise<AppUser[]> {
  if (isMocking && mockFlags.IS_MOCKING_SEARCH_USERS) {
    await new Promise((r) => setTimeout(r, 250));
    const all = getMockUsersCache();
    if (!query.trim()) return all.slice(0, 10);
    const q = query.toLowerCase();
    return all.filter(
      (u) =>
        u.username.toLowerCase().includes(q) ||
        u.firstName.toLowerCase().includes(q) ||
        u.lastName.toLowerCase().includes(q),
    );
  }
  return apiFetch<AppUser[]>(
    `/users/search?q=${encodeURIComponent(query)}`,
    {},
    token,
  );
}

export async function getPendingInvites(
  userId: string,
  token: string,
): Promise<PendingInvite[]> {
  if (isMocking && mockFlags.IS_MOCKING_GET_PENDING_INVITES) {
    await new Promise((r) => setTimeout(r, 300));
    return getMockPendingInvites().filter(
      (i) => i.toUserId === userId || i.toUserId === "__current__",
    );
  }
  return apiFetch<PendingInvite[]>("/teams/invites/pending", {}, token);
}

export async function acceptInvite(
  inviteId: string,
  currentUser: {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
  },
  token: string,
): Promise<void> {
  if (isMocking && mockFlags.IS_MOCKING_ACCEPT_INVITE) {
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
            role: "representative" as const,
          },
        ],
        createdAt: invite.createdAt,
      };
      getMockTeamCache().push(team);
    }
    if (!team.members.find((m) => m.id === currentUser.id)) {
      team.members.push({ ...currentUser, role: "calciatore" as const });
    }
    pendingInviteCache = invites.filter((i) => i.id !== inviteId);
    return;
  }
  return apiFetch<void>(
    `/teams/invites/${inviteId}/accept`,
    { method: "POST" },
    token,
  );
}

export async function rejectInvite(
  inviteId: string,
  token: string,
): Promise<void> {
  if (isMocking && mockFlags.IS_MOCKING_REJECT_INVITE) {
    await new Promise((r) => setTimeout(r, 300));
    pendingInviteCache = getMockPendingInvites().filter(
      (i) => i.id !== inviteId,
    );
    return;
  }
  return apiFetch<void>(
    `/teams/invites/${inviteId}/reject`,
    { method: "POST" },
    token,
  );
}

export async function getSentInvites(
  teamId: string,
  token: string,
): Promise<PendingInvite[]> {
  if (isMocking && mockFlags.IS_MOCKING_GET_SENT_INVITES) {
    await new Promise((r) => setTimeout(r, 200));
    return getMockPendingInvites().filter(
      (i) => i.teamId === teamId && i.toUserId !== "__current__",
    );
  }
  return apiFetch<PendingInvite[]>(`/teams/${teamId}/invites`, {}, token);
}

export async function updateMemberRole(
  teamId: string,
  memberId: string,
  newRole: TeamRole,
  token: string,
): Promise<void> {
  if (isMocking && mockFlags.IS_MOCKING_UPDATE_MEMBER_ROLE) {
    await new Promise((r) => setTimeout(r, 300));
    const team = getMockTeamCache().find((t) => t.id === teamId);
    if (!team) throw new Error("Squadra non trovata");
    const member = team.members.find((m) => m.id === memberId);
    if (!member) throw new Error("Membro non trovato");
    if (member.role === "representative")
      throw new Error("Non puoi cambiare il ruolo del rappresentante");
    if (newRole === "allenatore") {
      const existing = team.members.find(
        (m) => m.role === "allenatore" && m.id !== memberId,
      );
      if (existing) throw new Error("La squadra ha già un allenatore");
    }
    if (newRole === "portiere") {
      const existing = team.members.find(
        (m) => m.role === "portiere" && m.id !== memberId,
      );
      if (existing) throw new Error("La squadra ha già un portiere");
    }
    member.role = newRole;
    return;
  }
  return apiFetch<void>(
    `/teams/${teamId}/members/${memberId}/role`,
    { method: "PATCH", body: JSON.stringify({ role: newRole }) },
    token,
  );
}
