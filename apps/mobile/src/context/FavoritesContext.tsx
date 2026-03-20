import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Tournament } from '../types';
import {
  fetchFavorites,
  addFavorite as apiAdd,
  removeFavorite as apiRemove,
} from '../api/favorites';
import { useAuth } from './AuthContext';

interface FavoritesContextType {
  favorites: Tournament[];
  addFavorite: (tournament: Tournament) => void;
  removeFavorite: (tournamentId: string) => void;
  isFavorite: (tournamentId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Tournament[]>([]);

  // Load favorites from the API whenever the logged-in user changes.
  // In mock mode fetchFavorites returns the module-level in-memory cache.
  useEffect(() => {
    if (!user) {
      setFavorites([]);
      return;
    }
    fetchFavorites(user.token).then(setFavorites).catch(() => {});
  }, [user?.id]);

  const addFavorite = (tournament: Tournament) => {
    setFavorites((prev) =>
      prev.some((t) => t.id === tournament.id) ? prev : [...prev, tournament],
    );
    if (user) apiAdd(tournament, user.token).catch(() => {});
  };

  const removeFavorite = (tournamentId: string) => {
    setFavorites((prev) => prev.filter((t) => t.id !== tournamentId));
    if (user) apiRemove(tournamentId, user.token).catch(() => {});
  };

  const isFavorite = (tournamentId: string) =>
    favorites.some((t) => t.id === tournamentId);

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider');
  return ctx;
}
