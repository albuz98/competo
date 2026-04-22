export const MONTHS = [
  "Gen",
  "Feb",
  "Mar",
  "Apr",
  "Mag",
  "Giu",
  "Lug",
  "Ago",
  "Set",
  "Ott",
  "Nov",
  "Dic",
];

export const SPORT_EMOJI: Record<string, string> = {
  Calcio: "⚽",
  "Calcio a 7": "⚽",
  "Calcio a 5": "⚽",
};

export type inputTextContentType =
  | "none"
  | "oneTimeCode"
  | "password"
  | "newPassword"
  | "username"
  | "emailAddress"
  | "name"
  | "givenName"
  | "familyName"
  | "telephoneNumber"
  | "addressCity"
  | "addressState"
  | "addressCityAndState"
  | "sublocality"
  | "countryName"
  | "postalCode"
  | "streetAddressLine1"
  | "streetAddressLine2"
  | "creditCardNumber"
  | "creditCardSecurityCode";

export type textAutoCapitalize = "none" | "sentences" | "words" | "characters";

export const GAMES = ["Calcio", "Calcio a 7", "Calcio a 5"];
