import { isMocking, apiFetch } from './config';
import { generateTournaments, generateTournament, generateMyTournaments, generateMyTournament, generateOrganizerTournamentDetail } from '../mock/data';
import type { Tournament, MyTournament, OrganizerTournamentDetail } from '../types';

// Persistent mock store so data stays consistent across navigation
let mockCache: Tournament[] | null = null;

function getMockCache(): Tournament[] {
  if (!mockCache) {
    mockCache = generateTournaments(12);
  }
  return mockCache;
}

export function addToMockCache(tournament: Tournament) {
  getMockCache().push(tournament);
}

export function getMockTournamentIds(): string[] {
  return getMockCache().map((t) => t.id);
}

export async function fetchTournaments(): Promise<Tournament[]> {
  if (isMocking) {
    await new Promise((r) => setTimeout(r, 700));
    return getMockCache();
  }

  return apiFetch<Tournament[]>('/tournaments');
}

export async function fetchTournament(id: string): Promise<Tournament> {
  if (isMocking) {
    await new Promise((r) => setTimeout(r, 400));
    const found = getMockCache().find((t) => t.id === id);
    return found ?? generateTournament(id);
  }

  return apiFetch<Tournament>(`/tournaments/${id}`);
}

// ─── My tournaments (with bracket/groups data) ───────────────────────────────

let myTournamentsCache: MyTournament[] | null = null;

export function getMyTournamentsCache(): MyTournament[] {
  if (!myTournamentsCache) {
    myTournamentsCache = generateMyTournaments(5);
  }
  return myTournamentsCache;
}

export async function fetchMyTournaments(): Promise<MyTournament[]> {
  if (isMocking) {
    await new Promise((r) => setTimeout(r, 500));
    return getMyTournamentsCache();
  }
  return apiFetch<MyTournament[]>('/my-tournaments');
}

export async function fetchMyTournament(id: string): Promise<MyTournament> {
  if (isMocking) {
    await new Promise((r) => setTimeout(r, 300));
    const found = getMyTournamentsCache().find((t) => t.id === id);
    return found ?? generateMyTournament(id);
  }
  return apiFetch<MyTournament>(`/my-tournaments/${id}`);
}

export async function signUpForTournament(
  tournamentId: string,
  token: string,
  teamId?: string,
): Promise<void> {
  if (isMocking) {
    await new Promise((r) => setTimeout(r, 600));
    const cache = getMockCache();
    const idx = cache.findIndex((t) => t.id === tournamentId);
    if (idx !== -1) {
      cache[idx] = {
        ...cache[idx],
        isRegistered: true,
        currentParticipants: cache[idx].currentParticipants + 1,
      };
    }
    return;
  }

  return apiFetch<void>(
    `/tournaments/${tournamentId}/signup`,
    { method: 'POST', body: JSON.stringify({ teamId }) },
    token,
  );
}

// Returns tournaments within `radiusKm` km of the given coordinates.
// In real mode the server returns lat/lng for each tournament.
// In mock mode all tournaments are returned (EsploraScreen assigns fake coordinates client-side).
export async function fetchNearbyTournaments(
  lat: number,
  lng: number,
  radiusKm = 50,
  token?: string,
): Promise<Tournament[]> {
  if (isMocking) {
    await new Promise((r) => setTimeout(r, 400));
    return [...getMockCache()];
  }
  const params = new URLSearchParams({
    lat: String(lat),
    lng: String(lng),
    radius: String(radiusKm),
  });
  return apiFetch<Tournament[]>(`/tournaments/nearby?${params}`, {}, token);
}

export async function activateTournament(tournamentId: string, token: string): Promise<void> {
  if (isMocking) {
    await new Promise((r) => setTimeout(r, 600));
    const t = getMyTournamentsCache().find((t) => t.id === tournamentId);
    if (t) t.isGenerated = true;
    return;
  }
  return apiFetch<void>(`/my-tournaments/${tournamentId}/activate`, { method: 'POST' }, token);
}

// ─── Organizer tournament management ─────────────────────────────────────────

let organizerCacheMap: Map<string, OrganizerTournamentDetail> | null = null;

function getOrganizerCache(): Map<string, OrganizerTournamentDetail> {
  if (!organizerCacheMap) {
    organizerCacheMap = new Map();
    getMyTournamentsCache()
      .filter((t) => t.isOrganizer)
      .forEach((t, i) => {
        organizerCacheMap!.set(t.id, generateOrganizerTournamentDetail(t, i === 0));
      });
  }
  return organizerCacheMap;
}

export async function fetchOrganizerTournament(id: string): Promise<OrganizerTournamentDetail> {
  if (isMocking) {
    await new Promise((r) => setTimeout(r, 300));
    const cached = getOrganizerCache().get(id);
    if (cached) return { ...cached, registeredTeams: [...cached.registeredTeams] };
    const base = getMyTournamentsCache().find((t) => t.id === id) ?? generateMyTournament(id);
    const detail = generateOrganizerTournamentDetail(base, false);
    getOrganizerCache().set(id, detail);
    return { ...detail, registeredTeams: [...detail.registeredTeams] };
  }
  return apiFetch<OrganizerTournamentDetail>(`/organizer/tournaments/${id}`);
}

export async function approveTeam(tournamentId: string, teamId: string): Promise<void> {
  if (isMocking) {
    await new Promise((r) => setTimeout(r, 400));
    const t = getOrganizerCache().get(tournamentId);
    const team = t?.registeredTeams.find((r) => r.id === teamId);
    if (team) {
      team.status = 'accepted';
      team.paymentDeadline = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    }
    return;
  }
  return apiFetch<void>(`/organizer/tournaments/${tournamentId}/teams/${teamId}/approve`, { method: 'POST' });
}

export async function rejectTeam(tournamentId: string, teamId: string): Promise<void> {
  if (isMocking) {
    await new Promise((r) => setTimeout(r, 400));
    const t = getOrganizerCache().get(tournamentId);
    const team = t?.registeredTeams.find((r) => r.id === teamId);
    if (team) team.status = 'rejected';
    return;
  }
  return apiFetch<void>(`/organizer/tournaments/${tournamentId}/teams/${teamId}/reject`, { method: 'POST' });
}

export async function removeTeam(tournamentId: string, teamId: string): Promise<void> {
  if (isMocking) {
    await new Promise((r) => setTimeout(r, 400));
    const t = getOrganizerCache().get(tournamentId);
    if (t) t.registeredTeams = t.registeredTeams.filter((r) => r.id !== teamId);
    return;
  }
  return apiFetch<void>(`/organizer/tournaments/${tournamentId}/teams/${teamId}`, { method: 'DELETE' });
}
