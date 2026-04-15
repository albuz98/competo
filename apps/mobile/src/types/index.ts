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

export type PlayerCareerRole = "calciatore" | "portiere";

export interface PlayerCareerStats {
  playerRole: PlayerCareerRole;
  goals?: number; // solo calciatore
  goalsConceded?: number; // solo portiere
  yellowCards: number;
  redCards: number;
}

export enum TournamentResult {
  WON = "won",
  SECOND = "second",
  THIRD = "third",
  ELIMINATED = "eliminated",
}

export interface PlayedTournamentRecord {
  id: string;
  name: string;
  sport: string;
  date: string; // ISO date string
  location: string;
  result: TournamentResult;
  teamName: string;
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

export enum TeamRole {
  REPRESENTATIVE = "representative",
  CALCIORE = "calciatore",
  ALLENATORE = "allenatore",
  PORTEIRE = "portiere",
}

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
  avatarUrl?: string;
  role: TeamRole;
  jerseyNumber?: number;
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
  avatarUrl?: string;
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
  avatarUrl?: string;
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

export enum UserRole {
  PLAYER = "player",
  ORGANIZER = "organizer",
}

// OrganizerCollaborator shares the same shape as AppUser — no duplication needed
export type OrganizerCollaborator = AppUser;

export type PlayerProfile = {
  id: string;
  role: UserRole.PLAYER;
  username: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  careerStats?: PlayerCareerStats;
};

export type OrganizerProfile = {
  id: string;
  role: UserRole.ORGANIZER;
  avatarUrl?: string;
  orgName: string;
  isCreator: boolean;
  collaborators?: OrganizerCollaborator[];
};

// Discriminated union: ogni profilo è esplicito sul suo ruolo
export type UserProfile = PlayerProfile | OrganizerProfile;

export interface User {
  id: string;
  firstName?: string;
  lastName?: string;
  username: string;
  email: string;
  token: string;
  dateOfBirth?: string;
  location?: string;
  avatarUrl?: string;
  matchStats?: MatchStats;
  playedTournaments?: PlayedTournamentRecord[];
  organizedTournaments?: OrganizedTournamentRecord[];
  profiles?: UserProfile[];
  currentProfileId?: string;
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

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  username?: string;
  location?: string;
  password?: string;
  avatarUrl?: string;
}

// ─── Tournament Generator ─────────────────────────────────────────────────────

export type TournamentFormat =
  | "round-robin"
  | "knockout"
  | "double-elimination";

export type TournamentPhaseKind = "single" | "multi";

export interface GeneratorParticipant {
  name: string;
}

export interface GeneratorConfig {
  tournamentName?: string;
  description?: string;
  location?: string;
  participants: GeneratorParticipant[];
  phaseKind: TournamentPhaseKind;
  format: TournamentFormat;
  multiKnockoutFormat?: TournamentFormat; // knockout phase format when phaseKind === "multi"
  numGroups?: number; // for multi-phase: how many groups (gironi), default 2
  numFields: number;
  matchDurationMinutes: number;
  restMinutes: number;
  travelMinutes: number;
  startDate: string; // YYYY-MM-DD
  startHour: number;
  playDays: number[]; // 0=Sun..6=Sat
  maxMatchesPerDayPerTeam: number;
  maxMatchesPerDay?: number; // total matches per day across all fields
  hasFinalDay: boolean;
  finalDayDate?: string; // YYYY-MM-DD — exact date for quarters/semis/final when hasFinalDay
  singleDay?: boolean; // if true, no end-of-day cutoff
}

export interface ScheduledMatch {
  id: string;
  homeTeam: string;
  awayTeam: string;
  field: number;
  startTime: string; // ISO
  endTime: string; // ISO
  round: number;
  phase: "main" | "groups" | "knockout" | "losers" | "final";
  isBye: boolean;
  roundLabel: string;
}

export interface TeamSchedule {
  teamName: string;
  matches: ScheduledMatch[];
}

export interface GeneratorGroup {
  name: string;
  teams: string[];
}

export interface StandingsEntry {
  teamName: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  points: number;
  goalsFor: number;
  goalsAgainst: number;
}

export interface GeneratorOutput {
  config: GeneratorConfig;
  allMatches: ScheduledMatch[];
  teamSchedules: TeamSchedule[];
  standings: StandingsEntry[];
  groups?: GeneratorGroup[];
}

export interface CreateTournamentPayload {
  config: GeneratorConfig;
  lat?: number;
  lng?: number;
  regulationUri?: string;
}

export interface TournametNumberPartecipants {
  total: number;
  groups: number;
  knockout: number;
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
  Notifiche: undefined;
  Teams: undefined;
  CreateTeam: undefined;
  TeamDetail: { teamId: string };
  InvitePlayers: { teamId: string };
  InviteCollaborators: { profileId: string };
  OrganizerTournamentDetail: { tournamentId: string };
  CreateTournamentSchedule: undefined;
  TournamentScheduleResult: undefined;
  TournamentHistory: undefined;
  Settings: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Explore: undefined;
  Favorites: undefined;
  Notification: undefined;
  Profile: { startEdit?: boolean } | undefined;
};

export type Suggestion = {
  displayName: string;
  lat: number;
  lng: number;
};

export enum NavigationEnum {
  EXPLORE = "Explore",
  HOME = "Home",
  FAVORITES = "Favorites",
  NOTIFICATION = "Notification",
  PROFILE = "Profile",

  CHOSE_ACCESS = "ChoseAccess",
  LOGIN = "Login",
  REGISTER = "Register",
  MAIN_TABS = "MainTabs",
  TOURNAMENT_DETAIL = "TournamentDetail",
  MY_TOURNAMENT_DETAIL = "MyTournamentDetail",
  PAYMENT = "Payment",
  TEAM_SELECT = "TeamSelect",
  FORGOT_PASSWORD = "ForgotPassword",
  NOTIFICHE = "Notifiche",
  TEAMS = "Teams",
  CREATE_TEAM = "CreateTeam",
  TEAM_DETAIL = "TeamDetail",
  INVITE_PLAYERS = "InvitePlayers",
  INVITE_COLLABORATORS = "InviteCollaborators",
  ORGANIZER_TOURNAMENT_DETAIL = "OrganizerTournamentDetail",
  CREATE_TOURNAMENT_SCHEDULE = "CreateTournamentSchedule",
  TOURNAMENT_SCHEDULE_RESULT = "TournamentScheduleResult",
  TOURNAMENT_HISTORY = "TournamentHistory",
  SETTINGS = "Settings",
}
