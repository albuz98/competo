import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import {
  fetchFavorites,
  addFavorite as apiAdd,
  removeFavorite as apiRemove,
} from "../api/favorites";
import { useAuth } from "./AuthContext";
import { Tournament } from "../types/tournament";

interface FavoritesContextType {
  favorites: Tournament[];
  addFavorite: (tournament: Tournament) => void;
  removeFavorite: (tournamentId: string) => void;
  isFavorite: (tournamentId: string) => boolean;
  wasAddedWhenFull: (tournamentId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Tournament[]>([]);
  const [fullWhenAddedIds, setFullWhenAddedIds] = useState<string[]>([]);

  // Load favorites from the API whenever the logged-in user changes.
  // In mock mode fetchFavorites returns the module-level in-memory cache.
  useEffect(() => {
    if (!user) {
      setFavorites([]);
      setFullWhenAddedIds([]);
      return;
    }
    fetchFavorites(user.token)
      .then(setFavorites)
      .catch(() => {});
  }, [user?.id]);

  const addFavorite = (tournament: Tournament) => {
    setFavorites((prev) =>
      prev.some((t) => t.id === tournament.id) ? prev : [...prev, tournament],
    );
    if (tournament.currentParticipants >= tournament.maxParticipants) {
      setFullWhenAddedIds((prev) =>
        prev.includes(tournament.id) ? prev : [...prev, tournament.id],
      );
    }
    if (user) apiAdd(tournament, user.token).catch(() => {});
  };

  const removeFavorite = (tournamentId: string) => {
    setFavorites((prev) => prev.filter((t) => t.id !== tournamentId));
    setFullWhenAddedIds((prev) => prev.filter((id) => id !== tournamentId));
    if (user) apiRemove(tournamentId, user.token).catch(() => {});
  };

  const isFavorite = (tournamentId: string) =>
    favorites.some((t) => t.id === tournamentId);

  const wasAddedWhenFull = (tournamentId: string) =>
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
