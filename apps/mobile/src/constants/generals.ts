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

export enum TeamSport {
  FOOTBALL = "football",
}

export enum TeamFormat {
  FIVE_A_SIDE = "five_a_side",
  SEVEN_A_SIDE = "seven_a_side",
  ELEVEN_A_SIDE = "eleven_a_side",
}

export const TEAM_FORMAT_OPTIONS: {
  label: string;
  format: TeamFormat;
  sport: TeamSport;
}[] = [
  { label: "Calcio a 5", format: TeamFormat.FIVE_A_SIDE, sport: TeamSport.FOOTBALL },
  { label: "Calcio a 7", format: TeamFormat.SEVEN_A_SIDE, sport: TeamSport.FOOTBALL },
  { label: "Calcio a 11", format: TeamFormat.ELEVEN_A_SIDE, sport: TeamSport.FOOTBALL },
];

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

export const GAMES = ["Calcio a 5", "Calcio a 7", "Calcio a 11"];
