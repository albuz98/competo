import { EntityType } from "../types/organizer";

export function getOrgDocConfig(entityType: EntityType | null): {
  label: string;
  hint: string;
  required: boolean;
} | null {
  switch (entityType) {
    case "asd":
    case "ssd":
      return {
        label: "Statuto dell'associazione",
        hint: "Documento che descrive scopo, governance e regole dell'associazione (PDF)",
        required: true,
      };
    case "societa":
    case "azienda":
      return {
        label: "Visura camerale",
        hint: "Estratto dal Registro Imprese (Camera di Commercio) che certifica P.IVA, sede legale e amministratori (PDF)",
        required: true,
      };
    case "comune":
      return {
        label: "Atto istitutivo / Delibera",
        hint: "Delibera comunale o atto che autorizza l'organizzazione di eventi sportivi (PDF)",
        required: false,
      };
    case "privato":
      // Privati non devono caricare documenti dell'ente
      return null;
    case "altro":
    default:
      return {
        label: "Documento dell'organizzazione",
        hint: "Statuto, visura, delibera o altro documento che attesti la legittimità dell'ente (PDF, opzionale)",
        required: false,
      };
  }
}
