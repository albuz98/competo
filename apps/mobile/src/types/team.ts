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

export interface TeamDetailResponse {
  id: number;
  name: string;
  sport: string;
  format: string;
  city: string;
  logo_url: string;
  rating: number;
  representative_id: number;
}

export interface TeamMemberResponse {
  id: number;
  user_id: number;
  role: string;
  is_active: boolean;
  joined_at: string;
  // Enriched in mock mode only
  firstName?: string;
  lastName?: string;
  username?: string;
  jerseyNumber?: number;
}

export type InvitationStatus = "pending" | "accepted" | "declined";

export interface TeamInvitation {
  id: number;
  team_id: number;
  invited_user_id: number;
  invited_by: number;
  status: InvitationStatus;
  created_at: string;
  resolved_at: string | null;
  // Enriched in mock mode only
  firstName?: string;
  lastName?: string;
  username?: string;
}

export const ROLE_LABEL: Record<string, string> = {
  [TeamRole.REPRESENTATIVE]: "Rappresentante",
  [TeamRole.PLAYER]: "Calciatore",
  [TeamRole.COACH]: "Allenatore",
  [TeamRole.GOLKEEPER]: "Portiere",
};

export const HAS_JERSEY: Record<string, boolean> = {
  [TeamRole.REPRESENTATIVE]: true,
  [TeamRole.PLAYER]: true,
  [TeamRole.GOLKEEPER]: true,
  [TeamRole.COACH]: false,
};
