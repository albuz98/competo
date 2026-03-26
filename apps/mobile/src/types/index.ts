export type TournamentStatus = "upcoming" | "ongoing" | "completed";

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

// ─── Tournament structure (brackets / groups) ────────────────────────────────

export interface TournamentTeam {
  id: string;
  name: string;
  isMyTeam: boolean;
}

export interface TournamentMatch {
  id: string;
  homeTeam: TournamentTeam;
  awayTeam: TournamentTeam;
  homeScore: number | null;
  awayScore: number | null;
  status: "scheduled" | "live" | "finished";
  round?: string;
}

export interface TournamentGroup {
  id: string;
  name: string;
  teams: TournamentTeam[];
  matches: TournamentMatch[];
}

export interface KnockoutRound {
  name: string;
  matches: TournamentMatch[];
}

export interface TournamentBracket {
  rounds: KnockoutRound[];
}

export type TournamentStructure =
  | { kind: "groups"; groups: TournamentGroup[]; userGroupId: string }
  | { kind: "knockout"; bracket: TournamentBracket };

export interface MyTournament extends Tournament {
  structure: TournamentStructure;
  isGenerated?: boolean; // false = waiting for organizer to generate the bracket; defaults to true
  isOrganizer?: boolean; // true = current user is the tournament organizer
}

// ─── Stats & history types ────────────────────────────────────────────────────

export interface MatchStats {
  matchesPlayed: number;
  wins: number;
  losses: number;
  draws: number;
  tournamentsPlayed: number;
  tournamentsWon: number;
}

export interface OrganizedTournamentRecord {
  id: string;
  name: string;
  sport: string;
  date: string; // ISO date string of tournament start
  location: string;
  totalTeams: number;
  totalPrizeMoney: string; // e.g. "$5,000"
}

// ─── Team types ───────────────────────────────────────────────────────────────

export type TeamRole =
  | "representative"
  | "calciatore"
  | "allenatore"
  | "portiere";

export interface PendingInvite {
  id: string;
  teamId: string;
  teamName: string;
  sport: string;
  fromUserId: string;
  fromFirstName: string;
  fromLastName: string;
  toUserId: string;
  createdAt: string;
}

export interface TeamMember {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  avatarUri?: string;
  role: TeamRole;
}

export interface Team {
  id: string;
  name: string;
  sport: string;
  members: TeamMember[];
  createdAt: string;
}

export interface AppUser {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  avatarUri?: string;
}

// ─── Tournament player & registration types ──────────────────────────────────

export interface PlayerStats {
  goals: number;
  matchesPlayed: number;
  yellowCards: number;
  redCards: number;
}

export type TeamRegistrationStatus =
  | "pending_approval"
  | "rejected"
  | "accepted"
  | "paid";

export interface TournamentPlayer {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  avatarUri?: string;
  dateOfBirth?: string;
  role: TeamRole;
  stats: PlayerStats;
}

export interface TournamentRegisteredTeam {
  id: string;
  name: string;
  players: TournamentPlayer[];
  status: TeamRegistrationStatus;
  registeredAt: string;
  paymentDeadline?: string;
}

export interface OrganizerTournamentDetail extends MyTournament {
  registeredTeams: TournamentRegisteredTeam[];
}

// ─── Auth types ───────────────────────────────────────────────────────────────

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
  isOrganizer?: boolean;
  matchStats?: MatchStats;
  organizedTournaments?: OrganizedTournamentRecord[];
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

// ─── Navigation ───────────────────────────────────────────────────────────────

export type RootStackParamList = {
  ChoseAccess: undefined;
  Login: { redirect?: "tournament"; tournamentId?: string };
  Register: undefined;
  MainTabs: undefined;
  TournamentDetail: { tournamentId: string; justRegistered?: boolean };
  MyTournamentDetail: { tournamentId: string };
  Payment: {
    tournamentId: string;
    entryFee: string;
    tournamentName: string;
    teamId?: string;
    teamName?: string;
  };
  TeamSelect: {
    tournamentId: string;
    entryFee: string;
    tournamentName: string;
  };
  ForgotPassword: undefined;
  EditProfile: undefined;
  Notifiche: undefined;
  Teams: undefined;
  CreateTeam: undefined;
  TeamDetail: { teamId: string };
  InvitePlayers: { teamId: string };
  OrganizerTournamentDetail: { tournamentId: string };
  PlayerProfile: { playerJson: string };
};

export type MainTabParamList = {
  Home: undefined;
  Esplora: undefined;
  Preferiti: undefined;
  Profilo: undefined;
};
