import type { MatchStats, PlayerCareerStats } from "./stats";
import { TournamentResult } from "../constants/tournament";
import { AppUser } from "./team";

export enum Gender {
  MALE = "maschio",
  FEMALE = "femmina",
  OTHER = "non_definito",
}

export enum UserRole {
  PLAYER = "player",
  ORGANIZER = "organizer",
}

export type OrganizerCollaborator = AppUser;

export type PlayerProfile = {
  id: string;
  role: UserRole.PLAYER;
  username: string;
  first_name?: string;
  last_name?: string;
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
  pendingApproval?: boolean;
};

// Discriminated union: ogni profilo è esplicito sul suo ruolo
export type UserProfile = PlayerProfile | OrganizerProfile;

export interface User {
  id: string;
  first_name?: string;
  last_name?: string;
  username: string;
  email: string;
  token: string;
  birthdate?: string;
  location?: string;
  gender?: Gender;
  avatarUrl?: string;
  isEmailConfirmed?: boolean;
  matchStats?: MatchStats;
  playedTournaments?: PlayedTournamentRecord[];
  organizedTournaments?: OrganizedTournamentRecord[];
  profiles?: UserProfile[];
  currentProfileId?: string;
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
