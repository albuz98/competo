import { colors } from "../theme/colors";

export enum TournamentResult {
  WON = "won",
  SECOND = "second",
  THIRD = "third",
  ELIMINATED = "eliminated",
}

export enum TournamentFormat {
  ROUND_ROBIN = "round-robin",
  KNOCKOUT = "knockout",
  DOUBLE_ELIMINATION = "double-elimination",
}

export enum TeamRegistrationStatus {
  PENDING_APPROVAL = "pending_approval",
  REJECTED = "rejected",
  ACCEPTED = "accepted",
  PAID = "paid",
}

export enum TournamentPhaseKind {
  SINGLE = "single",
  MULTI = "multi",
}

export const PHASES: {
  value: TournamentPhaseKind;
  label: string;
  sub: string;
  icon: string;
}[] = [
  {
    value: TournamentPhaseKind.SINGLE,
    label: "Fase Unica",
    sub: "Un solo formato per tutto il torneo",
    icon: "arrow-forward-circle-outline",
  },
  {
    value: TournamentPhaseKind.MULTI,
    label: "Multi-fase",
    sub: "Gironi (girone all'italiana) poi fase ad eliminazione",
    icon: "git-merge-outline",
  },
];

export const SINGLE_FORMATS: {
  value: TournamentFormat;
  label: string;
  sub: string;
  icon: string;
}[] = [
  {
    value: TournamentFormat.ROUND_ROBIN,
    label: "Girone all'italiana",
    sub: "Ogni squadra affronta tutte le altre. V=3, P=1, S=0",
    icon: "refresh-circle-outline",
  },
  {
    value: TournamentFormat.KNOCKOUT,
    label: "Eliminazione Diretta",
    sub: "Sconfitti eliminati. Seeding automatico (1ª vs ultima)",
    icon: "trophy-outline",
  },
  {
    value: TournamentFormat.DOUBLE_ELIMINATION,
    label: "Doppia Eliminazione",
    sub: "Torneo A + Torneo B (Ultima Chance). Reset finale possibile",
    icon: "repeat-outline",
  },
];

export const KO_FORMATS: {
  value: TournamentFormat;
  label: string;
  sub: string;
  icon: string;
}[] = [
  {
    value: TournamentFormat.KNOCKOUT,
    label: "Eliminazione Diretta",
    sub: "Sconfitti eliminati al primo errore. Seeding automatico",
    icon: "trophy-outline",
  },
  {
    value: TournamentFormat.DOUBLE_ELIMINATION,
    label: "Doppia Eliminazione",
    sub: "Torneo A + Torneo B (Ultima Chance). Reset finale possibile",
    icon: "repeat-outline",
  },
];

export const DAY_LABELS = ["D", "L", "M", "M", "G", "V", "S"];

export enum SportRegulation {
  CALCIO_5 = "calcio_5",
  KING_LEAGUE = "king_league",
  FUTSAL = "futsal",
  CALCIO_11 = "calcio_11",
}

export enum TournamentGender {
  MASCHILE = "maschile",
  FEMMINILE = "femminile",
  MISTO = "misto",
}

export const SPORT_REGULATIONS: {
  value: SportRegulation;
  label: string;
  icon: string;
  downloadUrl: string;
}[] = [
  {
    value: SportRegulation.CALCIO_5,
    label: "Calcio a 5",
    icon: "football-outline",
    downloadUrl: "https://example.com/regolamento-calcio-a-5.pdf",
  },
  {
    value: SportRegulation.KING_LEAGUE,
    label: "King League",
    icon: "trophy-outline",
    downloadUrl: "https://example.com/regolamento-king-league.pdf",
  },
  {
    value: SportRegulation.FUTSAL,
    label: "Futsal",
    icon: "flash-outline",
    downloadUrl: "https://example.com/regolamento-futsal.pdf",
  },
  {
    value: SportRegulation.CALCIO_11,
    label: "Calcio a 11",
    icon: "people-outline",
    downloadUrl: "https://example.com/regolamento-calcio-a-11.pdf",
  },
];

export const TOURNAMENT_GENDERS: {
  value: TournamentGender;
  label: string;
  icon: string;
}[] = [
  { value: TournamentGender.MASCHILE, label: "Maschile", icon: "man-outline" },
  {
    value: TournamentGender.FEMMINILE,
    label: "Femminile",
    icon: "woman-outline",
  },
  { value: TournamentGender.MISTO, label: "Misto", icon: "people-outline" },
];

export const STEP_TITLES_TOURNAMENT = [
  "Info Torneo",
  "Regolamento",
  "Struttura",
  "Partecipanti",
  "Logistica",
  "Calendario",
];

export const RESULT_CONFIG: Record<
  TournamentResult,
  { label: string; color: string }
> = {
  won: { label: "1° Posto", color: colors.gold },
  second: { label: "2° Posto", color: colors.silver },
  third: { label: "3° Posto", color: colors.bronze },
  eliminated: { label: "Eliminato", color: colors.grayDark },
};
