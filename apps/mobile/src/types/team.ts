import { TeamRole } from "../constants/team";

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
