import React, { createContext, useContext, useState, type ReactNode } from 'react';

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  timestamp: string;
  read: boolean;
}

const MOCK: AppNotification[] = [
  {
    id: '1',
    title: 'Nuovo torneo vicino a te',
    body: 'È stato aperto un nuovo torneo di Calcio a 5 km da te. Iscriviti ora!',
    timestamp: '2026-03-18T10:00:00Z',
    read: false,
  },
  {
    id: '2',
    title: 'Iscrizione confermata',
    body: 'La tua iscrizione al torneo "Pro Cup" è stata confermata con successo.',
    timestamp: '2026-03-17T15:30:00Z',
    read: false,
  },
  {
    id: '3',
    title: 'Il torneo inizia domani',
    body: '"Elite League" inizia domani alle 10:00. Buona fortuna!',
    timestamp: '2026-03-16T09:00:00Z',
    read: true,
  },
  {
    id: '4',
    title: 'Risultato disponibile',
    body: 'Il risultato del tuo ultimo torneo è disponibile nella sezione Preferiti.',
    timestamp: '2026-03-15T18:00:00Z',
    read: true,
  },
  {
    id: '5',
    title: 'Nuovo messaggio dall\'organizzatore',
    body: 'L\'organizzatore di "Masters Cup" ti ha inviato un messaggio.',
    timestamp: '2026-03-14T12:00:00Z',
    read: true,
  },
];

interface NotificationsContextType {
  notifications: AppNotification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

const NotificationsContext = createContext<NotificationsContextType | null>(null);

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<AppNotification[]>(MOCK);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );

  const markAllAsRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  return (
    <NotificationsContext.Provider
      value={{ notifications, unreadCount, markAsRead, markAllAsRead }}
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
