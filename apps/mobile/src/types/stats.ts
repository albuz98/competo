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

export interface CoachMatchStats {
  wins: number;
  draws: number;
  losses: number;
  tournamentsWon: number;
  tournamentsPlayed: number;
  matchesPlayed: number;
  yellowCards: number;
  redCards: number;
}

export interface TeamStats {
  wins: number;
  draws: number;
  losses: number;
  tournamentsWon: number;
  tournamentsPlayed: number;
  matchesPlayed: number;
  goalsScored: number;
  yellowCards: number;
  redCards: number;
}

export interface TeamPlayerGoalStat {
  playerId: number;
  playerName: string;
  goals: number;
}
