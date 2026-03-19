import React, { createContext, useContext, useState, type ReactNode } from 'react';
import { getMockTournamentIds } from '../api/tournaments';

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  timestamp: string;
  read: boolean;
  tournamentId?: string;
}

function createMockNotifications(): AppNotification[] {
  const ids = getMockTournamentIds();
  return [
    {
      id: '1',
      title: 'Iscrizione confermata',
      body: `La tua iscrizione al torneo è stata confermata con successo.`,
      timestamp: '2026-03-17T15:30:00Z',
      read: false,
      tournamentId: ids[0],
    },
    {
      id: '2',
      title: 'Il torneo inizia domani',
      body: 'Il tuo torneo inizia domani alle 10:00. Buona fortuna!',
      timestamp: '2026-03-16T09:00:00Z',
      read: false,
      tournamentId: ids[1],
    },
    {
      id: '3',
      title: 'Risultato disponibile',
      body: 'Il risultato del tuo ultimo torneo è disponibile.',
      timestamp: '2026-03-15T18:00:00Z',
      read: true,
      tournamentId: ids[2],
    },
    {
      id: '4',
      title: "Nuovo messaggio dall'organizzatore",
      body: "L'organizzatore ti ha inviato un messaggio riguardo al torneo.",
      timestamp: '2026-03-14T12:00:00Z',
      read: true,
      tournamentId: ids[3],
    },
    {
      id: '5',
      title: 'Sei stato invitato!',
      body: 'Marco Bianchi ti ha invitato nella squadra "Milano United". Vai nelle squadre per accettare.',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      read: false,
    },
  ];
}

interface NotificationsContextType {
  notifications: AppNotification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addNotification: (n: Omit<AppNotification, 'id' | 'read'>) => void;
}

const NotificationsContext = createContext<NotificationsContextType | null>(null);

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<AppNotification[]>(() => createMockNotifications());

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );

  const markAllAsRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  const addNotification = (n: Omit<AppNotification, 'id' | 'read'>) =>
    setNotifications((prev) => [
      { ...n, id: String(Date.now()), read: false },
      ...prev,
    ]);

  return (
    <NotificationsContext.Provider
      value={{ notifications, unreadCount, markAsRead, markAllAsRead, addNotification }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext);
  if (!ctx)
    throw new Error('useNotifications must be used within NotificationsProvider');
  return ctx;
}
