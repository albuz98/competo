import { faker } from "@faker-js/faker";
import {
  MyTournament,
  Tournament,
  TournamentGroup,
  TournamentMatch,
  TournamentStructure,
  TournamentTeam,
} from "../types/tournament";
import { GAMES } from "../constants/generals";
import { TournamentGender } from "../constants/tournament";

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
  const hasLogo = faker.datatype.boolean();
  const hasImage = faker.datatype.boolean();

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
    gender: faker.helpers.arrayElement([
      TournamentGender.MALE,
      TournamentGender.FEMALE,
      TournamentGender.OTHER,
    ]),
    organizer: faker.company.name(),
    rules: Array.from({ length: faker.number.int({ min: 3, max: 6 }) }, () =>
      faker.lorem.sentence(),
    ),
    isRegistered: false,
    logoUrl: hasLogo ? faker.image.avatar() : undefined,
    imageUrl: hasImage
      ? `https://picsum.photos/seed/${faker.string.uuid()}/600/300`
      : undefined,
  };
}

export function generateTournaments(count = 12): Tournament[] {
  return Array.from({ length: count }, () => generateTournament());
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
