export type RootStackParamList = {
  ChoseAccess: undefined;
  Login: { redirect?: "tournament"; tournamentId?: string };
  Register: undefined;
  MainTabs: undefined;
  TournamentDetail: { tournamentId: string; justRegistered?: boolean };
  MyTournamentDetail: { tournamentId: string };
  Payment: {
    tournamentId: string;
    entryFee: string;
    tournamentName: string;
    teamId?: string;
    teamName?: string;
  };
  TeamSelect: {
    tournamentId: string;
    entryFee: string;
    tournamentName: string;
  };
  ForgotPassword: undefined;
  Notifiche: undefined;
  Teams: undefined;
  CreateTeam: undefined;
  TeamDetail: { teamId: string };
  InvitePlayers: { teamId: string };
  InviteCollaborators: { profileId: string };
  OrganizerTournamentDetail: { tournamentId: string };
  CreateTournamentSchedule: undefined;
  TournamentScheduleResult: undefined;
  TournamentHistory: undefined;
  Settings: undefined;
  CreateOrganizerProfile: undefined;
  ChangePassword: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Explore: undefined;
  Favorites: undefined;
  Notification: undefined;
  Profile: { startEdit?: boolean } | undefined;
};

export enum NavigationEnum {
  EXPLORE = "Explore",
  HOME = "Home",
  FAVORITES = "Favorites",
  NOTIFICATION = "Notification",
  PROFILE = "Profile",
  CHOSE_ACCESS = "ChoseAccess",
  LOGIN = "Login",
  REGISTER = "Register",
  MAIN_TABS = "MainTabs",
  TOURNAMENT_DETAIL = "TournamentDetail",
  MY_TOURNAMENT_DETAIL = "MyTournamentDetail",
  PAYMENT = "Payment",
  TEAM_SELECT = "TeamSelect",
  FORGOT_PASSWORD = "ForgotPassword",
  NOTIFICHE = "Notifiche",
  TEAMS = "Teams",
  CREATE_TEAM = "CreateTeam",
  TEAM_DETAIL = "TeamDetail",
  INVITE_PLAYERS = "InvitePlayers",
  INVITE_COLLABORATORS = "InviteCollaborators",
  ORGANIZER_TOURNAMENT_DETAIL = "OrganizerTournamentDetail",
  CREATE_TOURNAMENT_SCHEDULE = "CreateTournamentSchedule",
  TOURNAMENT_SCHEDULE_RESULT = "TournamentScheduleResult",
  TOURNAMENT_HISTORY = "TournamentHistory",
  SETTINGS = "Settings",
  CREATE_ORGANIZER_PROFILE = "CreateOrganizerProfile",
  CHANGE_PASSWORD = "ChangePassword",
}
