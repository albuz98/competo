import { faker } from "@faker-js/faker";
import {
  type Tournament,
  type User,
  type MyTournament,
  type TournamentStructure,
  type TournamentTeam,
  type TournamentMatch,
  type TournamentGroup,
  type Team,
  type TeamMember,
  type TeamRole,
  type AppUser,
  type PlayerStats,
  type TeamRegistrationStatus,
  type TournamentPlayer,
  type TournamentRegisteredTeam,
  type OrganizerTournamentDetail,
  UserRole,
} from "../types";

export const GAMES = [
  "Calcio",
  "Basket",
  "Pallavolo",
  "Tennis",
  "Padel",
  "Rugby",
  "Ping Pong",
  "Calcio a 5",
  "Beach Volley",
  "Badminton",
];

const STATUSES = ["upcoming", "ongoing", "completed"] as const;

const ADJECTIVES = [
  "Pro",
  "Open",
  "Elite",
  "Champion",
  "Masters",
  "Grand",
  "Ultimate",
  "Premier",
];
const NOUNS = [
  "Cup",
  "League",
  "Series",
  "Championship",
  "Invitational",
  "Tournament",
  "Challenge",
];

export function generateTournament(id?: string): Tournament {
  const status = faker.helpers.arrayElement(STATUSES);
  const maxParticipants = faker.helpers.arrayElement([8, 16, 32, 64, 128]);

  const currentParticipants =
    status === "upcoming"
      ? faker.number.int({ min: 0, max: maxParticipants - 1 })
      : maxParticipants;

  const startDate =
    status === "upcoming"
      ? faker.date.soon({ days: 60 }).toISOString()
      : faker.date.recent({ days: 30 }).toISOString();

  const endDate = new Date(
    new Date(startDate).getTime() +
      faker.number.int({ min: 1, max: 7 }) * 24 * 60 * 60 * 1000,
  ).toISOString();

  return {
    id: id ?? faker.string.uuid(),
    name: `${faker.helpers.arrayElement(ADJECTIVES)} ${faker.helpers.arrayElement(NOUNS)} ${new Date(startDate).getFullYear()}`,
    game: faker.helpers.arrayElement(GAMES),
    startDate,
    endDate,
    maxParticipants,
    currentParticipants,
    prizePool: `$${(faker.number.int({ min: 1, max: 100 }) * 500).toLocaleString()}`,
    description: faker.lorem.paragraph(3),
    status,
    location: faker.helpers.arrayElement([
      "Online",
      `${faker.location.city()}, ${faker.location.country()}`,
    ]),
    entryFee: faker.helpers.arrayElement(["Free", "$10", "$25", "$50", "$100"]),
    organizer: faker.company.name(),
    rules: Array.from({ length: faker.number.int({ min: 3, max: 6 }) }, () =>
      faker.lorem.sentence(),
    ),
    isRegistered: false,
  };
}

export function generateTournaments(count = 12): Tournament[] {
  return Array.from({ length: count }, () => generateTournament());
}

// ─── Mock profile ─────────────────────────────────────────────────────────────
// Edit these fields directly to control what fetchProfile / login / register
// return when isMocking = true.
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
      result: "won" as const,
      teamName: "Milan FC",
    },
    {
      id: "pt-002",
      name: "Summer Cup 2024",
      sport: "Calcio",
      date: "2024-07-22T10:00:00.000Z",
      location: "Roma, Italia",
      result: "runner_up" as const,
      teamName: "Milan FC",
    },
    {
      id: "pt-003",
      name: "Winter League 2024",
      sport: "Calcio",
      date: "2024-01-15T10:00:00.000Z",
      location: "Torino, Italia",
      result: "eliminated" as const,
      teamName: "Rossoneri United",
    },
    {
      id: "pt-004",
      name: "Pro Cup 2023",
      sport: "Calcio",
      date: "2023-11-05T10:00:00.000Z",
      location: "Napoli, Italia",
      result: "won" as const,
      teamName: "Rossoneri United",
    },
    {
      id: "pt-005",
      name: "City League 2023",
      sport: "Calcio",
      date: "2023-06-20T10:00:00.000Z",
      location: "Firenze, Italia",
      result: "eliminated" as const,
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
  role: TeamRole = "calciatore",
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
  status: TeamRegistrationStatus = "pending_approval",
): TournamentRegisteredTeam {
  const playerCount = faker.number.int({ min: 5, max: 11 });
  const extraRoles: TeamRole[] = Array(Math.max(0, playerCount - 3)).fill(
    "calciatore",
  );
  const roles: TeamRole[] = [
    "representative",
    "portiere",
    "allenatore",
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
        generateTournamentRegisteredTeam("paid"),
      )
    : [
        generateTournamentRegisteredTeam("paid"),
        generateTournamentRegisteredTeam("paid"),
        generateTournamentRegisteredTeam("accepted"),
        generateTournamentRegisteredTeam("pending_approval"),
      ];
  return {
    ...base,
    maxParticipants: MAX_TEAMS,
    currentParticipants: registeredTeams.filter((t) => t.status !== "rejected")
      .length,
    registeredTeams,
  };
}

// ─── Tournament structure generators ─────────────────────────────────────────

function makeTournamentTeam(name: string, isMyTeam: boolean): TournamentTeam {
  return { id: faker.string.uuid(), name, isMyTeam };
}

function makeTournamentTeams(
  count: number,
  myTeamIndex: number,
): TournamentTeam[] {
  return Array.from({ length: count }, (_, i) =>
    makeTournamentTeam(
      `${faker.location.city()} ${faker.helpers.arrayElement(["FC", "SC", "United", "Atletico", "Tigers"])}`,
      i === myTeamIndex,
    ),
  );
}

function makeTournamentMatch(
  homeTeam: TournamentTeam,
  awayTeam: TournamentTeam,
  status: "scheduled" | "live" | "finished",
  round?: string,
): TournamentMatch {
  return {
    id: faker.string.uuid(),
    homeTeam,
    awayTeam,
    homeScore:
      status !== "scheduled" ? faker.number.int({ min: 0, max: 3 }) : null,
    awayScore:
      status !== "scheduled" ? faker.number.int({ min: 0, max: 3 }) : null,
    status,
    round,
  };
}

function generateGroupStructure(): TournamentStructure {
  const numGroups = 2;
  const teamsPerGroup = 4;
  const myGroupIndex = faker.number.int({ min: 0, max: numGroups - 1 });
  const groups: TournamentGroup[] = [];

  for (let g = 0; g < numGroups; g++) {
    const myTeamIndex =
      g === myGroupIndex
        ? faker.number.int({ min: 0, max: teamsPerGroup - 1 })
        : -1;
    const teams = makeTournamentTeams(teamsPerGroup, myTeamIndex);
    const matches: TournamentMatch[] = [];
    let matchIdx = 0;

    // Round-robin: C(4,2) = 6 matches
    for (let i = 0; i < teams.length; i++) {
      for (let j = i + 1; j < teams.length; j++) {
        let status: "scheduled" | "live" | "finished";
        if (matchIdx < 3) status = "finished";
        else if (matchIdx === 3) status = "live";
        else status = "scheduled";
        const giornata = Math.floor(matchIdx / 2) + 1;
        matches.push(
          makeTournamentMatch(
            teams[i],
            teams[j],
            status,
            `Giornata ${giornata}`,
          ),
        );
        matchIdx++;
      }
    }

    groups.push({
      id: faker.string.uuid(),
      name: `Girone ${String.fromCharCode(65 + g)}`,
      teams,
      matches,
    });
  }

  return { kind: "groups", groups, userGroupId: groups[myGroupIndex].id };
}

function generateKnockoutStructure(): TournamentStructure {
  const qfTeams = makeTournamentTeams(8, 0);

  const qfMatches: TournamentMatch[] = [];
  for (let i = 0; i < 4; i++) {
    const status: "finished" | "live" | "scheduled" =
      i < 2 ? "finished" : i === 2 ? "live" : "scheduled";
    qfMatches.push(
      makeTournamentMatch(qfTeams[i * 2], qfTeams[i * 2 + 1], status),
    );
  }

  const sfTeams: TournamentTeam[] = [
    { id: faker.string.uuid(), name: "Vincitore QF-1", isMyTeam: true },
    { id: faker.string.uuid(), name: "Vincitore QF-2", isMyTeam: false },
    { id: faker.string.uuid(), name: "Vincitore QF-3", isMyTeam: false },
    { id: faker.string.uuid(), name: "Vincitore QF-4", isMyTeam: false },
  ];
  const sfMatches: TournamentMatch[] = [
    makeTournamentMatch(sfTeams[0], sfTeams[1], "scheduled"),
    makeTournamentMatch(sfTeams[2], sfTeams[3], "scheduled"),
  ];

  const finTeams: TournamentTeam[] = [
    { id: faker.string.uuid(), name: "Vincitore SF-1", isMyTeam: false },
    { id: faker.string.uuid(), name: "Vincitore SF-2", isMyTeam: false },
  ];

  return {
    kind: "knockout",
    bracket: {
      rounds: [
        { name: "Quarti di Finale", matches: qfMatches },
        { name: "Semifinali", matches: sfMatches },
        {
          name: "Finale",
          matches: [makeTournamentMatch(finTeams[0], finTeams[1], "scheduled")],
        },
      ],
    },
  };
}

export function generateMyTournament(id?: string, index = -1): MyTournament {
  const base = generateTournament(id);
  const isOrganizer = index === 0 || index === 1;
  const isGenerated = index >= 2 || index === -1;
  const structure: TournamentStructure =
    Math.random() < 0.7
      ? generateGroupStructure()
      : generateKnockoutStructure();
  return {
    ...base,
    status: "ongoing",
    isRegistered: true,
    structure,
    isOrganizer,
    isGenerated,
  };
}

export function generateMyTournaments(count = 5): MyTournament[] {
  return Array.from({ length: count }, (_, i) =>
    generateMyTournament(undefined, i),
  );
}

// ─── Team generators ──────────────────────────────────────────────────────────

export function generateTeamMember(role: TeamRole = "calciatore"): TeamMember {
  const hasJersey = role === "calciatore" || role === "portiere" || role === "representative";
  return {
    id: faker.string.uuid(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    username: faker.internet.username(),
    role,
    ...(hasJersey
      ? { jerseyNumber: faker.number.int({ min: 1, max: 99 }) }
      : {}),
  };
}

export function generateTeam(id?: string): Team {
  const memberCount = faker.number.int({ min: 2, max: 8 });
  const members: TeamMember[] = [
    generateTeamMember("representative"),
    ...Array.from({ length: memberCount - 1 }, () =>
      generateTeamMember("calciatore"),
    ),
  ];
  // Randomly assign special roles to at most 1 portiere and 1 allenatore
  const nonReps = members.filter((m) => m.role !== "representative");
  if (nonReps.length > 0) {
    nonReps[0].role = "portiere";
  }
  if (nonReps.length > 1) {
    nonReps[1].role = "allenatore";
  }
  return {
    id: id ?? faker.string.uuid(),
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
    id: faker.string.uuid(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    username: faker.internet.username(),
  };
}

export function generateAppUsers(count = 30): AppUser[] {
  return Array.from({ length: count }, () => generateAppUser());
}
