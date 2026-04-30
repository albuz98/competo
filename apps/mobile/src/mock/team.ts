import { faker } from "@faker-js/faker";
import { AppUser, Team, TeamMember } from "../types/team";
import { GAMES } from "../constants/generals";
import { TeamRole } from "../constants/team";

export function generateTeamMember(
  role: TeamRole = TeamRole.PLAYER,
): TeamMember {
  const hasJersey =
    role === TeamRole.PLAYER ||
    role === TeamRole.GOLKEEPER ||
    role === TeamRole.REPRESENTATIVE;
  return {
    id: faker.string.uuid(),
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
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
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    username: faker.internet.username(),
  };
}

export function generateAppUsers(count = 30): AppUser[] {
  return Array.from({ length: count }, () => generateAppUser());
}
