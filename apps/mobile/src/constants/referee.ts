export const STEP_TITLES_REFEREE = [
  "Dati Personali",
  "Dati Associazione",
  "Attività",
  "Tariffe",
  "Consensi",
];

export const REFEREE_RATE_TYPES = [
  { label: "A partita", value: "partita" },
  { label: "All'ora", value: "ora" },
] as const;
export type RefereeRateType = "partita" | "ora";

export const REFEREE_HOUR_RANGES: { label: string; value: string }[] = [
  { label: "1-3 ore", value: "1-3" },
  { label: "3-6 ore", value: "3-6" },
  { label: "6-10 ore", value: "6-10" },
  { label: "10-14 ore", value: "10-14" },
];

export const REFEREE_MAX_DISTANCES: { label: string; value: number }[] = [
  { label: "Entro 20 km", value: 20 },
  { label: "Entro 50 km", value: 50 },
  { label: "Entro 100 km", value: 100 },
  { label: "Illimitata", value: 0 },
];

export const REFEREE_ASSOCIATIONS = ["AIA", "CSI"] as const;
export type RefereeAssociationKey = (typeof REFEREE_ASSOCIATIONS)[number];

export const ASSOCIATION_LABELS: Record<
  RefereeAssociationKey,
  { number: string; section: string; sectionHint: string }
> = {
  AIA: {
    number: "Numero identificativo AIA",
    section: "Sezione AIA di appartenenza",
    sectionHint:
      "La sezione è la delegazione territoriale AIA (es. Roma, Milano) presso cui sei tesserato.",
  },
  CSI: {
    number: "Numero tesserino CSI",
    section: "Comitato CSI di appartenenza",
    sectionHint:
      "Il comitato è la sede territoriale CSI (es. Torino, Napoli) a cui appartieni.",
  },
};

export const REFEREE_SPORTS = [
  "Calcio a 5",
  "Calcio a 7",
  "Calcio a 9",
  "Calcio a 11",
  "Kings League",
];

export const REFEREE_CATEGORIES = [
  "Serie A",
  "Serie B",
  "Lega Pro",
  "Serie D",
  "Eccellenza",
  "Promozione",
  "Prima Categoria",
  "Seconda Categoria",
  "Terza Categoria",
  "Giovanili",
];

export const REFEREE_ROLES = [
  "Arbitro principale",
  "Assistente",
  "Quarto uomo",
];
