export type EntityType =
  | "asd"
  | "ssd"
  | "societa"
  | "azienda"
  | "comune"
  | "privato"
  | "altro";

export type LegalForm =
  | "associazione"
  | "srl"
  | "srls"
  | "spa"
  | "cooperativa"
  | "ditta_individuale"
  | "ente_pubblico"
  | "nessuna";

export const ENTITY_LABELS: Record<EntityType, string> = {
  asd: "ASD",
  ssd: "SSD",
  societa: "Società sportiva",
  azienda: "Azienda privata",
  comune: "Comune",
  privato: "Privato",
  altro: "Altro",
};
