export interface SearchCategory {
  id: number;
  name: string;
  path: string;
  lowestRank: number;  // best BSR achieved in this category (lower = more competitive)
  highestRank: number; // worst BSR achieved (higher number)
  productCount: number;
}
