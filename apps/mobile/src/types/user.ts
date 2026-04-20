import { UserRole } from "../constants/user";
import type { MatchStats, PlayerCareerStats } from "./stats";
import { TournamentResult } from "../constants/tournament";
import { Ionicons } from "@expo/vector-icons";
import { AppUser } from "./team";

export enum Gender {
  MALE = "maschio",
  FEMALE = "femmina",
  OTHER = "non_definito",
}

export const GENDER_LABELS: Record<Gender, string> = {
  [Gender.MALE]: "Maschio",
  [Gender.FEMALE]: "Femmina",
  [Gender.OTHER]: "Non definito",
};

export const GENDER_ICONS: Record<
  Gender,
  React.ComponentProps<typeof Ionicons>["name"]
> = {
  [Gender.MALE]: "male",
  [Gender.FEMALE]: "female",
  [Gender.OTHER]: "male-female",
};

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
  gender?: Gender;
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
