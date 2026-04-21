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
    value: EntityType.ASD,
    label: "ASD",
    sub: "Associazione Sportiva Dilettantistica",
    icon: "people-outline",
  },
  {
    value: EntityType.SSD,
    label: "SSD",
    sub: "Società Sportiva Dilettantistica (srl)",
    icon: "business-outline",
  },
  {
    value: EntityType.SOCIETY,
    label: "Società sportiva",
    sub: "Società sportiva professionistica",
    icon: "trophy-outline",
  },
  {
    value: EntityType.AGENCY,
    label: "Azienda privata",
    sub: "Azienda che organizza eventi sportivi",
    icon: "briefcase-outline",
  },
  {
    value: EntityType.MUNICIPAL,
    label: "Comune",
    sub: "Ente pubblico locale o istituzione municipale",
    icon: "flag-outline",
  },
  {
    value: EntityType.PRIVATE,
    label: "Privato",
    sub: "Organizzatore individuale",
    icon: "person-outline",
  },
  {
    value: EntityType.OTHER,
    label: "Altro",
    sub: "Ente o forma giuridica non elencata",
    icon: "ellipsis-horizontal-circle-outline",
  },
];

export const LEGAL_FORMS: { value: LegalForm; label: string }[] = [
  { value: LegalForm.ASSOCIATION, label: "Associazione" },
  { value: LegalForm.SRL, label: "S.r.l." },
  { value: LegalForm.SRLS, label: "S.r.l.s." },
  { value: LegalForm.SPA, label: "S.p.A." },
  { value: LegalForm.COOPERATIVE, label: "Cooperativa" },
  { value: LegalForm.INDIVIDUAL_BUSINESS, label: "Ditta individuale" },
  { value: LegalForm.PUBLIC_ENTITY, label: "Ente pubblico" },
  { value: LegalForm.NONE, label: "Nessuna (privato)" },
];

export const PDF_URLS = {
  terms: "https://competo.app/legal/termini-organizzatori.pdf",
  privacy: "https://competo.app/legal/privacy-policy.pdf",
  conduct: "https://competo.app/legal/codice-condotta-organizzatori.pdf",
};

export const ENTITY_LABELS: Record<EntityType, string> = {
  [EntityType.ASD]: "ASD",
  [EntityType.SSD]: "SSD",
  [EntityType.SOCIETY]: "Società sportiva",
  [EntityType.AGENCY]: "Azienda privata",
  [EntityType.MUNICIPAL]: "Comune",
  [EntityType.PRIVATE]: "Privato",
  [EntityType.OTHER]: "Altro",
};
