/**
 * Centralized query key factory.
 * Using functions ensures keys are structurally consistent and easy to invalidate.
 */
export const queryKeys = {
  // ─── Tournaments ───────────────────────────────────────────────────────────
  tournaments: () => ["tournaments"] as const,
  tournament: (id: string) => ["tournament", id] as const,
  nearbyTournaments: (lat: number, lng: number, radius: number) =>
    ["tournaments", "nearby", lat, lng, radius] as const,

  // ─── My tournaments (authenticated) ───────────────────────────────────────
  myTournaments: () => ["myTournaments"] as const,
  myTournament: (id: string) => ["myTournament", id] as const,

  // ─── Organizer ─────────────────────────────────────────────────────────────
  organizerTournament: (id: string) => ["organizerTournament", id] as const,

  // ─── Teams ────────────────────────────────────────────────────────────────
  teams: () => ["teams"] as const,
  teamDetail: (teamId: number) => ["teamDetail", teamId] as const,
  teamMembers: (teamId: number) => ["teamMembers", teamId] as const,
  teamInvitations: (teamId: number) => ["teamInvitations", teamId] as const,
  pendingInvites: () => ["pendingInvites"] as const,
  sentInvites: (teamId: string) => ["sentInvites", teamId] as const,

  // ─── Favorites ────────────────────────────────────────────────────────────
  favorites: () => ["favorites"] as const,

  // ─── Users ────────────────────────────────────────────────────────────────
  userSearch: (query: string) => ["userSearch", query] as const,
} as const;
