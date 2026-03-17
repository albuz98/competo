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
}

export interface User {
  id: string;
  username: string;
  email: string;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
}

export type RootStackParamList = {
  TournamentList: undefined;
  TournamentDetail: { tournamentId: string };
  Login: { redirect?: 'tournament'; tournamentId?: string };
  Register: undefined;
  Onboarding: undefined;
};
