import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchFavorites,
  addFavorite as apiAdd,
  removeFavorite as apiRemove,
} from "../api/favorites";
import { useAuth } from "./AuthContext";
import { Tournament } from "../types/tournament";
import { queryKeys } from "../lib/queryKeys";

interface FavoritesContextType {
  favorites: Tournament[];
  addFavorite: (tournament: Tournament) => void;
  removeFavorite: (tournamentId: number) => void;
  isFavorite: (tournamentId: number) => boolean;
  wasAddedWhenFull: (tournamentId: number) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const qc = useQueryClient();

  // Tracks IDs of full tournaments at the time they were bookmarked — used to
  // notify the user when a spot opens up. Pure local state, not persisted.
  const [fullWhenAddedIds, setFullWhenAddedIds] = useState<number[]>([]);

  // ─── Query ─────────────────────────────────────────────────────────────────

  const { data: favorites = [] } = useQuery({
    queryKey: queryKeys.favorites(),
    queryFn: () => fetchFavorites(user!.token),
    enabled: !!user,
  });

  // ─── Mutations (optimistic, fire-and-forget API sync) ──────────────────────

  const addFavorite = (tournament: Tournament) => {
    // Optimistic cache update — no need for useMutation since this is fire-and-forget
    qc.setQueryData<Tournament[]>(queryKeys.favorites(), (old = []) =>
      old.some((t) => t.id === tournament.id) ? old : [...old, tournament],
    );
    if (tournament.currentParticipants >= tournament.maxParticipants) {
      setFullWhenAddedIds((prev) =>
        prev.includes(tournament.id) ? prev : [...prev, tournament.id],
      );
    }
    if (user) apiAdd(tournament, user.token).catch(() => {});
  };

  const removeFavorite = (tournamentId: number) => {
    qc.setQueryData<Tournament[]>(queryKeys.favorites(), (old = []) =>
      old.filter((t) => t.id !== tournamentId),
    );
    setFullWhenAddedIds((prev) => prev.filter((id) => id !== tournamentId));
    if (user) apiRemove(tournamentId, user.token).catch(() => {});
  };

  const isFavorite = (tournamentId: number) =>
    favorites.some((t) => t.id === tournamentId);

  const wasAddedWhenFull = (tournamentId: number) =>
    fullWhenAddedIds.includes(tournamentId);

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addFavorite,
        removeFavorite,
        isFavorite,
        wasAddedWhenFull,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx)
    throw new Error("useFavorites must be used within FavoritesProvider");
  return ctx;
}
