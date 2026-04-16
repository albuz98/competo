import { EntityType, LegalForm } from "../types/organizer";

export const STEP_TITLES_ORGANIZER = [
  "Identità",
  "Sede e Contatti",
  "Dati Legali",
  "Documenti",
  "Consensi",
];

export const ENTITY_TYPES: {
  value: EntityType;
  label: string;
  sub: string;
  icon: string;
}[] = [
  {
    value: "asd",
    label: "ASD",
    sub: "Associazione Sportiva Dilettantistica",
    icon: "people-outline",
  },
  {
    value: "ssd",
    label: "SSD",
    sub: "Società Sportiva Dilettantistica (srl)",
    icon: "business-outline",
  },
  {
    value: "societa",
    label: "Società sportiva",
    sub: "Società sportiva professionistica",
    icon: "trophy-outline",
  },
  {
    value: "azienda",
    label: "Azienda privata",
    sub: "Azienda che organizza eventi sportivi",
    icon: "briefcase-outline",
  },
  {
    value: "comune",
    label: "Comune",
    sub: "Ente pubblico locale o istituzione municipale",
    icon: "flag-outline",
  },
  {
    value: "privato",
    label: "Privato",
    sub: "Organizzatore individuale",
    icon: "person-outline",
  },
  {
    value: "altro",
    label: "Altro",
    sub: "Ente o forma giuridica non elencata",
    icon: "ellipsis-horizontal-circle-outline",
  },
];

export const LEGAL_FORMS: { value: LegalForm; label: string }[] = [
  { value: "associazione", label: "Associazione" },
  { value: "srl", label: "S.r.l." },
  { value: "srls", label: "S.r.l.s." },
  { value: "spa", label: "S.p.A." },
  { value: "cooperativa", label: "Cooperativa" },
  { value: "ditta_individuale", label: "Ditta individuale" },
  { value: "ente_pubblico", label: "Ente pubblico" },
  { value: "nessuna", label: "Nessuna (privato)" },
];

export const PDF_URLS = {
  terms: "https://competo.app/legal/termini-organizzatori.pdf",
  privacy: "https://competo.app/legal/privacy-policy.pdf",
  conduct: "https://competo.app/legal/codice-condotta-organizzatori.pdf",
};
