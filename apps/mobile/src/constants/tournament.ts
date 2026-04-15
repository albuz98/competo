import { colors } from "../theme/colors";
import {
  TournamentFormat,
  TournamentPhaseKind,
  TournamentResult,
} from "../types";

export const PHASES: {
  value: TournamentPhaseKind;
  label: string;
  sub: string;
  icon: string;
}[] = [
  {
    value: "single",
    label: "Fase Unica",
    sub: "Un solo formato per tutto il torneo",
    icon: "arrow-forward-circle-outline",
  },
  {
    value: "multi",
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
    value: "round-robin",
    label: "Girone all'italiana",
    sub: "Ogni squadra affronta tutte le altre. V=3, P=1, S=0",
    icon: "refresh-circle-outline",
  },
  {
    value: "knockout",
    label: "Eliminazione Diretta",
    sub: "Sconfitti eliminati. Seeding automatico (1ª vs ultima)",
    icon: "trophy-outline",
  },
  {
    value: "double-elimination",
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
    value: "knockout",
    label: "Eliminazione Diretta",
    sub: "Sconfitti eliminati al primo errore. Seeding automatico",
    icon: "trophy-outline",
  },
  {
    value: "double-elimination",
    label: "Doppia Eliminazione",
    sub: "Torneo A + Torneo B (Ultima Chance). Reset finale possibile",
    icon: "repeat-outline",
  },
];

export const DAY_LABELS = ["D", "L", "M", "M", "G", "V", "S"];

export const STEP_TITLES = [
  "Info Torneo",
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
