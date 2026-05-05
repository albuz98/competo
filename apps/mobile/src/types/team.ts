import { TeamRole } from "../constants/team";

export interface PendingInvite {
  id: number;
  teamId: number;
  teamName: string;
  sport: string;
  fromUserId: number;
  fromFirstName: string;
  fromLastName: string;
  toUserId: number;
  createdAt: string;
}

export interface TeamMember {
  id: number;
  firstName?: string;
  lastName?: string;
  username: string;
  avatarUrl?: string;
  role: TeamRole;
  jerseyNumber?: number;
}

export interface Team {
  id: number;
  name: string;
  sport: string;
  members: TeamMember[];
  createdAt: string;
  logoUrl?: string;
}

export interface AppUser {
  id: number;
  firstName?: string;
  lastName?: string;
  username: string;
  avatarUrl?: string;
}
