import React, { createContext, useContext, useState, type ReactNode } from 'react';
import type { Tournament } from '../types';

interface FavoritesContextType {
  favorites: Tournament[];
  addFavorite: (tournament: Tournament) => void;
  removeFavorite: (tournamentId: string) => void;
  isFavorite: (tournamentId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Tournament[]>([]);

  const addFavorite = (tournament: Tournament) =>
    setFavorites((prev) => prev.some((t) => t.id === tournament.id) ? prev : [...prev, tournament]);

  const removeFavorite = (tournamentId: string) =>
    setFavorites((prev) => prev.filter((t) => t.id !== tournamentId));

  const isFavorite = (tournamentId: string) => favorites.some((t) => t.id === tournamentId);

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
