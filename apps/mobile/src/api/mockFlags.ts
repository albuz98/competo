// Individual mock flags for each API function.
// Only consulted when the global IS_MOCKING env flag is true.
// Set a flag to false to force that specific function to call the real API
// even while IS_MOCKING is enabled.

export const mockFlags = {
  // ─── Auth ─────────────────────────────────────────────────────────────────
  IS_MOCKING_LOGIN: false,
  IS_MOCKING_REGISTER: false,
  IS_MOCKING_LOGOUT: false,

  // ─── Users ───────────────────────────────────────────────────────────────
  IS_MOCKING_FETCH_PROFILE: true,
  //delete - Delete me
  IS_MOCKING_UPDATE_PROFILE: false,
  //get - get player profile
  //put - upsert player profile
  //get - get my invitations
  IS_MOCKING_SEARCH_USERS: false,
  IS_MOCKING_FETCH_FAVORITES: false,
  IS_MOCKING_ADD_FAVORITE: false,
  IS_MOCKING_REMOVE_FAVORITE: false,
  //post - register device token
  //delete - deletedevice token

  // ─── Teams ────────────────────────────────────────────────────────────────
  IS_MOCKING_CREATE_TEAM: false,
  IS_MOCKING_FETCH_TEAM_DETAIL: false,
  //patch - Update team
  IS_MOCKING_DELETE_TEAM: false,
  IS_MOCKING_FETCH_TEAM_MEMBERS: false,
  IS_MOCKING_LEAVE_TEAM: false,
  IS_MOCKING_GET_TEAM_INVITATIONS: false,
  IS_MOCKING_INVITE_MEMBER: false,
  IS_MOCKING_ACCEPT_INVITE: false,
  IS_MOCKING_REJECT_INVITE: false,

  // ──────────────────────────── TO DO ───────────────────────────────────────
  IS_MOCKING_FORGOT_PASSWORD: true,
  IS_MOCKING_REGISTER_PUSH_TOKEN: true,

  // ─── Tournaments ──────────────────────────────────────────────────────────
  IS_MOCKING_FETCH_TOURNAMENTS: true,
  IS_MOCKING_FETCH_TOURNAMENT: true,
  IS_MOCKING_FETCH_MY_TOURNAMENTS: true,
  IS_MOCKING_FETCH_MY_TOURNAMENT: true,
  IS_MOCKING_SIGN_UP_FOR_TOURNAMENT: true,
  IS_MOCKING_FETCH_NEARBY_TOURNAMENTS: true,
  IS_MOCKING_CREATE_TOURNAMENT: true,
  IS_MOCKING_ACTIVATE_TOURNAMENT: true,
  IS_MOCKING_FETCH_ORGANIZER_TOURNAMENT: true,
  IS_MOCKING_APPROVE_TEAM: true,
  IS_MOCKING_REJECT_TEAM_FROM_TOURNAMENT: true,
  IS_MOCKING_REMOVE_MEMBER: true,
  IS_MOCKING_REMOVE_TEAM_FROM_TOURNAMENT: true,

  // ─── Teams ───────────────────────────────────────────────────────────────-
  IS_MOCKING_FETCH_USER_TEAMS: true,
  IS_MOCKING_GET_PENDING_INVITES: true,
  IS_MOCKING_GET_SENT_INVITES: true,
  IS_MOCKING_UPDATE_MEMBER_ROLE: true,
  IS_MOCKING_UPDATE_TEAM: true,

  // ─── Organizer ────────────────────────────────────────────────────────────
  IS_MOCKING_SUBMIT_ORGANIZER_PROFILE: true,
};

// export const mockFlags = {
//   // ─── Auth ─────────────────────────────────────────────────────────────────
//   IS_MOCKING_LOGIN: false,
//   IS_MOCKING_REGISTER: false,
//   IS_MOCKING_FETCH_PROFILE: false,

//   IS_MOCKING_FORGOT_PASSWORD: true,
//   IS_MOCKING_UPDATE_PROFILE: true,
//   IS_MOCKING_REGISTER_PUSH_TOKEN: true,

//   // ─── Tournaments ──────────────────────────────────────────────────────────
//   IS_MOCKING_FETCH_TOURNAMENTS: true,
//   IS_MOCKING_FETCH_TOURNAMENT: true,
//   IS_MOCKING_FETCH_MY_TOURNAMENTS: true,
//   IS_MOCKING_FETCH_MY_TOURNAMENT: true,
//   IS_MOCKING_SIGN_UP_FOR_TOURNAMENT: true,
//   IS_MOCKING_FETCH_NEARBY_TOURNAMENTS: true,
//   IS_MOCKING_CREATE_TOURNAMENT: true,
//   IS_MOCKING_ACTIVATE_TOURNAMENT: true,
//   IS_MOCKING_FETCH_ORGANIZER_TOURNAMENT: true,
//   IS_MOCKING_APPROVE_TEAM: true,
//   IS_MOCKING_REJECT_TEAM_FROM_TOURNAMENT: true,
//   IS_MOCKING_REMOVE_TEAM_FROM_TOURNAMENT: true,

//   // ─── Teams ────────────────────────────────────────────────────────────────
//   IS_MOCKING_FETCH_USER_TEAMS: true,
//   IS_MOCKING_CREATE_TEAM: true,
//   IS_MOCKING_INVITE_MEMBER: true,
//   IS_MOCKING_REMOVE_MEMBER: true,
//   IS_MOCKING_SEARCH_USERS: true,
//   IS_MOCKING_GET_PENDING_INVITES: true,
//   IS_MOCKING_ACCEPT_INVITE: true,
//   IS_MOCKING_REJECT_INVITE: true,
//   IS_MOCKING_GET_SENT_INVITES: true,
//   IS_MOCKING_UPDATE_MEMBER_ROLE: true,

//   // ─── Organizer ────────────────────────────────────────────────────────────
//   IS_MOCKING_SUBMIT_ORGANIZER_PROFILE: true,

//   // ─── Favorites ────────────────────────────────────────────────────────────
//   IS_MOCKING_FETCH_FAVORITES: true,
//   IS_MOCKING_ADD_FAVORITE: true,
//   IS_MOCKING_REMOVE_FAVORITE: true,
// };
