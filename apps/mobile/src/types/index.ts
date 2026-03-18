export type TournamentStatus = 'upcoming' | 'ongoing' | 'completed';

export interface Tournament {
  id: string;
  name: string;
  game: string;
  startDate: string;
  endDate: string;
  maxParticipants: number;
  currentParticipants: number;
  prizePool: string;
  description: string;
  status: TournamentStatus;
  location: string;
  entryFee: string;
  organizer: string;
  rules: string[];
  isRegistered?: boolean;
  lat?: number;
  lng?: number;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  token: string;
  dateOfBirth?: string;
  location?: string;
  avatarUri?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  dateOfBirth: string;
}

export type RootStackParamList = {
  Login: { redirect?: 'tournament'; tournamentId?: string };
  Register: undefined;
  Onboarding: undefined;
  MainTabs: undefined;
  TournamentDetail: { tournamentId: string; justRegistered?: boolean };
  Payment: { tournamentId: string; entryFee: string; tournamentName: string };
  ForgotPassword: undefined;
  EditProfile: undefined;
  Notifiche: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Esplora: undefined;
  Preferiti: undefined;
  Profilo: undefined;
};
