import { faker } from '@faker-js/faker';
import type { Tournament, User } from '../types';

const GAMES = [
  'Calcio',
  'Basket',
  'Pallavolo',
  'Tennis',
  'Padel',
  'Rugby',
  'Ping Pong',
  'Calcio a 5',
  'Beach Volley',
  'Badminton',
];

const STATUSES = ['upcoming', 'ongoing', 'completed'] as const;

const ADJECTIVES = ['Pro', 'Open', 'Elite', 'Champion', 'Masters', 'Grand', 'Ultimate', 'Premier'];
const NOUNS = ['Cup', 'League', 'Series', 'Championship', 'Invitational', 'Tournament', 'Challenge'];

export function generateTournament(id?: string): Tournament {
  const status = faker.helpers.arrayElement(STATUSES);
  const maxParticipants = faker.helpers.arrayElement([8, 16, 32, 64, 128]);

  const currentParticipants =
    status === 'upcoming'
      ? faker.number.int({ min: 0, max: maxParticipants - 1 })
      : maxParticipants;

  const startDate =
    status === 'upcoming'
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
      'Online',
      `${faker.location.city()}, ${faker.location.country()}`,
    ]),
    entryFee: faker.helpers.arrayElement(['Free', '$10', '$25', '$50', '$100']),
    organizer: faker.company.name(),
    rules: Array.from(
      { length: faker.number.int({ min: 3, max: 6 }) },
      () => faker.lorem.sentence(),
    ),
    isRegistered: false,
  };
}

export function generateTournaments(count = 12): Tournament[] {
  return Array.from({ length: count }, () => generateTournament());
}

export function generateUser(overrides?: Partial<User>): User {
  return {
    id: faker.string.uuid(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    username: faker.internet.username(),
    email: faker.internet.email(),
    token: faker.string.alphanumeric(64),
    dateOfBirth: faker.date.birthdate({ min: 18, max: 60, mode: 'age' }).toISOString().slice(0, 10),
    ...overrides,
  };
}
