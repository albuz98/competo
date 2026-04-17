export type PlayerCareerRole = "calciatore" | "portiere";

export interface PlayerStats {
  goals: number;
  matchesPlayed: number;
  yellowCards: number;
  redCards: number;
}

export interface MatchStats {
  matchesPlayed: number;
  wins: number;
  losses: number;
  draws: number;
  tournamentsPlayed: number;
  tournamentsWon: number;
}

export interface PlayerCareerStats {
  playerRole: PlayerCareerRole;
  goals?: number; // solo calciatore
  goalsConceded?: number; // solo portiere
  yellowCards: number;
  redCards: number;
}
