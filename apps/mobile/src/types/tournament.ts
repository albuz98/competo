import { TeamRole } from "../constants/team";
import {
  TournamentPhaseKind,
  TournamentFormat,
  TeamRegistrationStatus,
  TournamentGender,
  FinalDayRound,
} from "../constants/tournament";
import { PlayerStats } from "./stats";

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
  finalDayHour?: number; // start hour for the final day (6-22)
  finalDayStartRound?: FinalDayRound; // first round on the final day; all subsequent rounds are included
  singleDay?: boolean; // if true, no end-of-day cutoff
}

export enum TournamentPhase {
  MAIN = "main",
  GROUPS = "groups",
  KNOCKOUT = "knockout",
  LOSERS = "losers",
  FINAL = "final",
}

export interface ScheduledMatch {
  id: string;
  homeTeam: string;
  awayTeam: string;
  field: number;
  startTime: string; // ISO
  endTime: string; // ISO
  round: number;
  phase: TournamentPhase;
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
  tournamentCost?: number;
  insuranceCost?: number;
  sportRegulation?: string;
  gender?: string;
}

export interface TournametNumberPartecipants {
  total: number;
  groups: number;
  knockout: number;
}

export interface TournamentPlayer {
  id: string;
  first_name: string;
  last_name: string;
  username: string;
  avatarUrl?: string;
  birthdate?: string;
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

export type TournamentStatus = "upcoming" | "ongoing" | "completed";

export interface Tournament {
  id: number;
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
  gender?: TournamentGender;
  isRegistered?: boolean;
  lat?: number;
  lng?: number;
  logoUrl?: string;
  imageUrl?: string;
}

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
