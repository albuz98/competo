import { faker } from "@faker-js/faker";
import { AppUser, PendingInvite, Team, TeamMember, TeamTournamentRecord } from "../types/team";
import { GAMES } from "../constants/generals";
import { TeamRole } from "../constants/team";
import { TeamPlayerGoalStat, TeamStats } from "../types/stats";
import { TournamentResult } from "../constants/tournament";

export let mockTeamCache: Team[] | null = null;
let mockUsersCache: AppUser[] | null = null;
let pendingInviteCache: PendingInvite[] | null = null;

export function generateTeamMember(
  role: TeamRole = TeamRole.PLAYER,
): TeamMember {
  const hasJersey =
    role === TeamRole.PLAYER ||
    role === TeamRole.GOLKEEPER ||
    role === TeamRole.REPRESENTATIVE;
  const gameRole =
    role === TeamRole.REPRESENTATIVE
      ? faker.helpers.arrayElement([TeamRole.PLAYER, TeamRole.GOLKEEPER])
      : undefined;
  return {
    id: faker.number.int(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    username: faker.internet.username(),
    role,
    ...(gameRole ? { gameRole } : {}),
    ...(hasJersey
      ? { jerseyNumber: faker.number.int({ min: 1, max: 99 }) }
      : {}),
  };
}

export function generateTeam(id?: number): Team {
  const memberCount = faker.number.int({ min: 2, max: 8 });
  const members: TeamMember[] = [
    generateTeamMember(TeamRole.REPRESENTATIVE),
    ...Array.from({ length: memberCount - 1 }, () =>
      generateTeamMember(TeamRole.PLAYER),
    ),
  ];
  // Randomly assign special roles to at most 1 portiere and 1 allenatore
  const nonReps = members.filter((m) => m.role !== TeamRole.REPRESENTATIVE);
  if (nonReps.length > 0) {
    nonReps[0].role = TeamRole.GOLKEEPER;
  }
  if (nonReps.length > 1) {
    nonReps[1].role = TeamRole.COACH;
  }
  return {
    id: id ?? faker.number.int(),
    name: `${faker.location.city()} ${faker.helpers.arrayElement(["FC", "SC", "United", "Tigers", "Eagles"])}`,
    sport: faker.helpers.arrayElement(GAMES),
    members,
    createdAt: faker.date.recent({ days: 180 }).toISOString(),
  };
}

export function generateTeams(count = 3): Team[] {
  return Array.from({ length: count }, () => generateTeam());
}

export function generateAppUser(): AppUser {
  return {
    id: faker.number.int(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    username: faker.internet.username(),
  };
}

export function generateAppUsers(count = 30): AppUser[] {
  return Array.from({ length: count }, () => generateAppUser());
}

export function getMockTeamCache(): Team[] {
  if (!mockTeamCache) {
    mockTeamCache = generateTeams(3);
  }
  return mockTeamCache;
}

export function getMockUsersCache(): AppUser[] {
  if (!mockUsersCache) {
    mockUsersCache = generateAppUsers(30);
  }
  return mockUsersCache;
}

const teamStatsCache = new Map<number, TeamStats>();
const teamGoalScorersCache = new Map<number, TeamPlayerGoalStat[]>();
const teamTournamentsCache = new Map<number, TeamTournamentRecord[]>();

export function getOrGenerateTeamStats(teamId: number): TeamStats {
  if (!teamStatsCache.has(teamId)) {
    const mp = faker.number.int({ min: 10, max: 60 });
    const wins = faker.number.int({ min: 3, max: mp });
    const losses = faker.number.int({ min: 0, max: mp - wins });
    const draws = mp - wins - losses;
    teamStatsCache.set(teamId, {
      wins,
      draws,
      losses,
      tournamentsWon: faker.number.int({ min: 0, max: 4 }),
      tournamentsPlayed: faker.number.int({ min: 2, max: 8 }),
      matchesPlayed: mp,
      goalsScored: faker.number.int({ min: wins * 2, max: wins * 4 + 10 }),
      yellowCards: faker.number.int({ min: 0, max: 20 }),
      redCards: faker.number.int({ min: 0, max: 5 }),
    });
  }
  return teamStatsCache.get(teamId)!;
}

export function getOrGenerateTeamGoalScorers(
  teamId: number,
  members: TeamMember[],
): TeamPlayerGoalStat[] {
  if (!teamGoalScorersCache.has(teamId)) {
    const scorers = members
      .filter((m) => m.role !== TeamRole.COACH)
      .map((m) => ({
        playerId: m.id,
        playerName: `${m.firstName ?? ""} ${m.lastName ?? ""}`.trim() || m.username,
        goals: faker.number.int({ min: 0, max: 15 }),
      }))
      .sort((a, b) => b.goals - a.goals);
    teamGoalScorersCache.set(teamId, scorers);
  }
  return teamGoalScorersCache.get(teamId)!;
}

const TOURNAMENT_NAMES = [
  "Coppa Primavera",
  "Summer Cup",
  "Winter League",
  "Pro Cup",
  "City League",
  "Elite Trophy",
  "Gran Premio",
];
const RESULTS: TournamentResult[] = [
  TournamentResult.WON,
  TournamentResult.SECOND,
  TournamentResult.THIRD,
  TournamentResult.ELIMINATED,
];

export function getOrGenerateTeamTournaments(
  teamId: number,
  members: TeamMember[],
): TeamTournamentRecord[] {
  if (!teamTournamentsCache.has(teamId)) {
    const count = faker.number.int({ min: 2, max: 5 });
    const scorers = members.filter((m) => m.role !== TeamRole.COACH);
    const records: TeamTournamentRecord[] = Array.from({ length: count }, (_, i) => {
      const scorersInTournament = scorers
        .filter(() => faker.datatype.boolean())
        .map((m) => ({
          playerId: m.id,
          playerName: `${m.firstName ?? ""} ${m.lastName ?? ""}`.trim() || m.username,
          goals: faker.number.int({ min: 1, max: 5 }),
        }))
        .filter((s) => s.goals > 0)
        .sort((a, b) => b.goals - a.goals);
      return {
        id: `team-t-${teamId}-${i}`,
        name: `${faker.helpers.arrayElement(TOURNAMENT_NAMES)} ${2023 + i}`,
        sport: faker.helpers.arrayElement(GAMES),
        date: faker.date.past({ years: 2 }).toISOString(),
        location: `${faker.location.city()}, Italia`,
        result: faker.helpers.arrayElement(RESULTS),
        scorers: scorersInTournament,
      };
    });
    teamTournamentsCache.set(teamId, records);
  }
  return teamTournamentsCache.get(teamId)!;
}

export function getMockPendingInvites(): PendingInvite[] {
  if (!pendingInviteCache) {
    pendingInviteCache = [
      {
        id: 1,
        teamId: 22,
        teamName: "Milano United",
        sport: "Calcio",
        fromUserId: 2,
        fromFirstName: "Marco",
        fromLastName: "Bianchi",
        toUserId: 0,
        createdAt: new Date(Date.now() - 7200000).toISOString(),
      },
    ];
  }
  return pendingInviteCache;
}
