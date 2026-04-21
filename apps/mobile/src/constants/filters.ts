import { SortOption } from "../types/filters";

export const PRICE_MAX = 5000;
export const THUMB_SIZE = 26;
export const MIN_GAP = 2;

export const SORT_OPTIONS: {
  value: SortOption;
  label: string;
  icon: string;
}[] = [
  { value: SortOption.DISTANCE, label: "Distanza", icon: "location-outline" },
  {
    value: SortOption.PRICE_ASC,
    label: "Prezzo crescente",
    icon: "trending-up-outline",
  },
  {
    value: SortOption.PRICE_DESC,
    label: "Prezzo decrescente",
    icon: "trending-down-outline",
  },
];
