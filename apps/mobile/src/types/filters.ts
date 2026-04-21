import { TournamentGender } from "../constants/tournament";

export enum SortOption {
  DISTANCE = "distance",
  PRICE_ASC = "price_asc",
  PRICE_DESC = "price_desc",
}

export interface FilterState {
  games: string[];
  genders: TournamentGender[];
  minPrice: number;
  maxPrice: number;
  sortBy: SortOption | null;
}
