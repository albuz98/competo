import { isMocking, apiFetch } from './config';
import { generateTournaments, generateTournament, generateMyTournaments, generateMyTournament } from '../mock/data';
import type { Tournament, MyTournament } from '../types';

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

export async function activateTournament(tournamentId: string, token: string): Promise<void> {
  if (isMocking) {
    await new Promise((r) => setTimeout(r, 600));
    const t = getMyTournamentsCache().find((t) => t.id === tournamentId);
    if (t) t.isGenerated = true;
    return;
  }
  return apiFetch<void>(`/my-tournaments/${tournamentId}/activate`, { method: 'POST' }, token);
}
