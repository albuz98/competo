import { isMocking, apiFetch } from './config';
import { generateTournaments, generateTournament } from '../mock/data';
import type { Tournament } from '../types';

// Persistent mock store so data stays consistent across navigation
let mockCache: Tournament[] | null = null;

function getMockCache(): Tournament[] {
  if (!mockCache) {
    mockCache = generateTournaments(12);
  }
  return mockCache;
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

export async function signUpForTournament(
  tournamentId: string,
  token: string,
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
    { method: 'POST' },
    token,
  );
}
