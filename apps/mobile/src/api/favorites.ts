import { isMocking, apiFetch } from "./config";
import { mockFlags } from "./mockFlags";
import type { Tournament } from "../types/navigation";

// Module-level cache for mock mode (mirrors what the real DB would store per user).
let mockFavoritesCache: Tournament[] = [];

export async function fetchFavorites(token: string): Promise<Tournament[]> {
  if (isMocking && mockFlags.IS_MOCKING_FETCH_FAVORITES) {
    await new Promise((r) => setTimeout(r, 300));
    return [...mockFavoritesCache];
  }
  return apiFetch<Tournament[]>("/favorites", {}, token);
}

// In real mode only the tournament ID is sent; the full object is needed in mock mode
// to populate the in-memory cache (the server derives the tournament data from its own DB).
export async function addFavorite(
  tournament: Tournament,
  token: string,
): Promise<void> {
  if (isMocking && mockFlags.IS_MOCKING_ADD_FAVORITE) {
    if (!mockFavoritesCache.find((t) => t.id === tournament.id)) {
      mockFavoritesCache.push(tournament);
    }
    return;
  }
  return apiFetch<void>(
    `/favorites/${tournament.id}`,
    { method: "POST" },
    token,
  );
}

export async function removeFavorite(
  tournamentId: string,
  token: string,
): Promise<void> {
  if (isMocking && mockFlags.IS_MOCKING_REMOVE_FAVORITE) {
    mockFavoritesCache = mockFavoritesCache.filter(
      (t) => t.id !== tournamentId,
    );
    return;
  }
  return apiFetch<void>(
    `/favorites/${tournamentId}`,
    { method: "DELETE" },
    token,
  );
}
