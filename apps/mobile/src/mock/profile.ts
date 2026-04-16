import { faker } from "@faker-js/faker";
import { TeamRole } from "../constants/team";
import {
  TeamRegistrationStatus,
  TournamentResult,
} from "../constants/tournament";
import {
  MyTournament,
  OrganizerTournamentDetail,
  TournamentPlayer,
  TournamentRegisteredTeam,
} from "../types/tournament";
import { UserRole } from "../constants/user";
import { PlayerStats } from "../types/stats";
import { User } from "../types/user";

export const mockProfile: User = {
  id: "mock-user-001",
  firstName: "Mario",
  lastName: "Rossi",
  username: "mario.rossi",
  email: "mario.rossi@example.com",
  token: "mock-token-abc123",
  dateOfBirth: "1990-05-15",
  location: "Milano, Italia",
  avatarUrl: undefined,

  matchStats: {
    matchesPlayed: 47,
    wins: 28,
    losses: 12,
    draws: 7,
    tournamentsPlayed: 8,
    tournamentsWon: 3,
  },
  organizedTournaments: [
    {
      id: "org-t-001",
      name: "Pro Cup 2025",
      sport: "Calcio",
      date: "2025-09-14T10:00:00.000Z",
      location: "Milano, Italia",
      totalTeams: 16,
      totalPrizeMoney: "$800",
    },
    {
      id: "org-t-002",
      name: "Elite League 2025",
      sport: "Basket",
      date: "2025-11-20T10:00:00.000Z",
      location: "Roma, Italia",
      totalTeams: 8,
      totalPrizeMoney: "$400",
    },
    {
      id: "org-t-003",
      name: "Grand Tournament 2024",
      sport: "Padel",
      date: "2024-06-05T10:00:00.000Z",
      location: "Torino, Italia",
      totalTeams: 32,
      totalPrizeMoney: "$3,200",
    },
  ],
  playedTournaments: [
    {
      id: "pt-001",
      name: "Coppa Primavera 2025",
      sport: "Calcio",
      date: "2025-03-10T10:00:00.000Z",
      location: "Milano, Italia",
      result: TournamentResult.WON,
      teamName: "Milan FC",
    },
    {
      id: "pt-002",
      name: "Summer Cup 2024",
      sport: "Calcio",
      date: "2024-07-22T10:00:00.000Z",
      location: "Roma, Italia",
      result: TournamentResult.SECOND,
      teamName: "Milan FC",
    },
    {
      id: "pt-003",
      name: "Winter League 2024",
      sport: "Calcio",
      date: "2024-01-15T10:00:00.000Z",
      location: "Torino, Italia",
      result: TournamentResult.ELIMINATED,
      teamName: "Rossoneri United",
    },
    {
      id: "pt-004",
      name: "Pro Cup 2023",
      sport: "Calcio",
      date: "2023-11-05T10:00:00.000Z",
      location: "Napoli, Italia",
      result: TournamentResult.THIRD,
      teamName: "Rossoneri United",
    },
    {
      id: "pt-005",
      name: "City League 2023",
      sport: "Calcio",
      date: "2023-06-20T10:00:00.000Z",
      location: "Firenze, Italia",
      result: TournamentResult.ELIMINATED,
      teamName: "FC Stars",
    },
  ],
  currentProfileId: "mock-user-001",
  profiles: [
    {
      id: "mock-user-001",
      username: "mario.rossi",
      avatarUrl: undefined,
      role: UserRole.PLAYER,
      firstName: "Mario",
      lastName: "Rossi",
      careerStats: {
        playerRole: "calciatore" as const,
        goals: 24,
        yellowCards: 6,
        redCards: 1,
      },
    },
    {
      id: "mock-user-002",
      avatarUrl: undefined,
      role: UserRole.ORGANIZER,
      orgName: "Parona Sport",
      isCreator: true,
      collaborators: [
        {
          id: "collab-001",
          firstName: "Luca",
          lastName: "Ferrari",
          username: "luca.ferrari",
        },
        {
          id: "collab-002",
          firstName: "Anna",
          lastName: "Conti",
          username: "anna.conti",
        },
      ],
    },
  ],
};

export function generatePlayerStats(): PlayerStats {
  return {
    goals: faker.number.int({ min: 0, max: 30 }),
    matchesPlayed: faker.number.int({ min: 5, max: 60 }),
    yellowCards: faker.number.int({ min: 0, max: 8 }),
    redCards: faker.number.int({ min: 0, max: 2 }),
  };
}

export function generateTournamentPlayer(
  role: TeamRole = TeamRole.PLAYER,
): TournamentPlayer {
  return {
    id: faker.string.uuid(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    username: faker.internet.username(),
    dateOfBirth: faker.date
      .birthdate({ min: 16, max: 40, mode: "age" })
      .toISOString()
      .slice(0, 10),
    role,
    stats: generatePlayerStats(),
  };
}

export function generateTournamentRegisteredTeam(
  status: TeamRegistrationStatus = TeamRegistrationStatus.PENDING_APPROVAL,
): TournamentRegisteredTeam {
  const playerCount = faker.number.int({ min: 5, max: 11 });
  const extraRoles: TeamRole[] = Array(Math.max(0, playerCount - 3)).fill(
    "calciatore",
  );
  const roles: TeamRole[] = [
    TeamRole.REPRESENTATIVE,
    TeamRole.GOLKEEPER,
    TeamRole.COACH,
    ...extraRoles,
  ];
  const players = roles.map((r) => generateTournamentPlayer(r));
  return {
    id: faker.string.uuid(),
    name: `${faker.location.city()} ${faker.helpers.arrayElement(["FC", "SC", "United", "Tigers", "Eagles"])}`,
    players,
    status,
    registeredAt: faker.date.recent({ days: 14 }).toISOString(),
    paymentDeadline:
      status === "accepted"
        ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        : undefined,
  };
}

export function generateOrganizerTournamentDetail(
  base: MyTournament,
  allPaid = false,
): OrganizerTournamentDetail {
  const MAX_TEAMS = 4;
  const registeredTeams: TournamentRegisteredTeam[] = allPaid
    ? Array.from({ length: MAX_TEAMS }, () =>
        generateTournamentRegisteredTeam(TeamRegistrationStatus.PAID),
      )
    : [
        generateTournamentRegisteredTeam(TeamRegistrationStatus.PAID),
        generateTournamentRegisteredTeam(TeamRegistrationStatus.PAID),
        generateTournamentRegisteredTeam(TeamRegistrationStatus.ACCEPTED),
        generateTournamentRegisteredTeam(
          TeamRegistrationStatus.PENDING_APPROVAL,
        ),
      ];
  return {
    ...base,
    maxParticipants: MAX_TEAMS,
    currentParticipants: registeredTeams.filter(
      (t) => t.status !== TeamRegistrationStatus.REJECTED,
    ).length,
    registeredTeams,
  };
}
