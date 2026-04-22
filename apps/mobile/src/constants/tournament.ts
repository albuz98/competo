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
}

export enum TournamentPhaseKind {
  SINGLE = "single",
  MULTI = "multi",
}

export enum TeamRegistrationStatus {
  PENDING_APPROVAL = "pending_approval",
  REJECTED = "rejected",
  ACCEPTED = "accepted",
  PAID = "paid",
}

export enum TournamentMode {
  CAMPIONATO = "campionato",
  ELIMINAZIONE_DIRETTA = "eliminazione-diretta",
  GIRONI_FASE_FINALE = "gironi-fase-finale",
}

export const TOURNAMENT_MODES: {
  value: TournamentMode;
  label: string;
  sub: string;
  icon: string;
}[] = [
  {
    value: TournamentMode.CAMPIONATO,
    label: "Campionato",
    sub: "Ogni squadra affronta tutte le altre. C'è sia andata che ritorno. V=3, P=1, S=0",
    icon: "refresh-circle-outline",
  },
  {
    value: TournamentMode.ELIMINAZIONE_DIRETTA,
    label: "Eliminazione Diretta",
    sub: "Le squadre perdenti sono eliminate direttamente dal torneo.",
    icon: "trophy-outline",
  },
  {
    value: TournamentMode.GIRONI_FASE_FINALE,
    label: "Gironi + Fase Finale",
    sub: "Fase a gironi, poi i migliori si sfidano in eliminazione diretta",
    icon: "git-merge-outline",
  },
];

export function tournamentModeToConfig(mode: TournamentMode): {
  phaseKind: TournamentPhaseKind;
  format: TournamentFormat;
  knockoutFormat: TournamentFormat;
} {
  switch (mode) {
    case TournamentMode.CAMPIONATO:
      return {
        phaseKind: TournamentPhaseKind.SINGLE,
        format: TournamentFormat.ROUND_ROBIN,
        knockoutFormat: TournamentFormat.KNOCKOUT,
      };
    case TournamentMode.ELIMINAZIONE_DIRETTA:
      return {
        phaseKind: TournamentPhaseKind.SINGLE,
        format: TournamentFormat.KNOCKOUT,
        knockoutFormat: TournamentFormat.KNOCKOUT,
      };
    case TournamentMode.GIRONI_FASE_FINALE:
      return {
        phaseKind: TournamentPhaseKind.MULTI,
        format: TournamentFormat.ROUND_ROBIN,
        knockoutFormat: TournamentFormat.KNOCKOUT,
      };
  }
}

export const DAY_LABELS = ["D", "L", "M", "M", "G", "V", "S"];

export enum FinalDayRound {
  QUARTI = "quarti",
  SEMIFINALI = "semifinali",
  TERZO_POSTO = "terzo_posto",
  FINALE = "finale",
}

export const FINAL_DAY_ROUNDS: {
  value: FinalDayRound;
  label: string;
  sub: string;
  minTeams: number;
}[] = [
  {
    value: FinalDayRound.QUARTI,
    label: "Quarti di finale",
    sub: "8 squadre rimaste",
    minTeams: 8,
  },
  {
    value: FinalDayRound.SEMIFINALI,
    label: "Semifinali",
    sub: "4 squadre rimaste",
    minTeams: 4,
  },
  {
    value: FinalDayRound.TERZO_POSTO,
    label: "3° posto",
    sub: "Finale per il bronzo",
    minTeams: 4,
  },
  {
    value: FinalDayRound.FINALE,
    label: "Finale",
    sub: "Partita conclusiva",
    minTeams: 2,
  },
];

export enum SportRegulation {
  CALCIO_5 = "calcio_5",
  KING_LEAGUE = "king_league",
  FUTSAL = "futsal",
  CALCIO_11 = "calcio_11",
}

export enum TournamentGender {
  MALE = "maschile",
  FEMALE = "femminile",
  OTHER = "misto",
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
    label: "Kings League",
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
  { value: TournamentGender.MALE, label: "Maschile", icon: "man-outline" },
  {
    value: TournamentGender.FEMALE,
    label: "Femminile",
    icon: "woman-outline",
  },
  { value: TournamentGender.OTHER, label: "Misto", icon: "people-outline" },
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
