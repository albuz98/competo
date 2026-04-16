import { UserRole } from "../constants/user";
import { MatchStats, PlayerCareerStats } from "./stats";
import { TournamentResult } from "../constants/tournament";
import { AppUser } from "./team";

export type PlayerCareerRole = "calciatore" | "portiere";

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
  pendingApproval?: boolean;
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
