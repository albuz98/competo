import { FilterState, SortOption } from "../types/filters";

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

export const EMPTY_FILTERS: FilterState = {
  games: [],
  genders: [],
  minPrice: 0,
  maxPrice: PRICE_MAX,
  sortBy: null,
};

export const ENTRY_FEE_ORDER: Record<string, number> = {
  Free: 0,
  $10: 10,
  $25: 25,
  $50: 50,
  $100: 100,
};
