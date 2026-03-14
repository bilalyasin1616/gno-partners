export interface CategoryNode {
  id: number;
  name: string;
}

export interface ChildProduct {
  asin: string;
  title: string;
  imageUrl: string | null;
  currentBsr: number | null;
  attributes: { dimension: string; value: string }[];
}

export interface ProductInfo {
  asin: string;
  title: string;
  description: string;
  bulletPoints: string[];
  imageUrl: string | null;
  currentBsr: number | null;
  rootCategoryId: number | null;
  categoryTree: CategoryNode[];
  isParent: boolean;
  parentAsin: string | null;
  children: ChildProduct[];
}

export interface SearchCategory {
  id: number;
  name: string;
  lowestRank: number;
  highestRank: number;
  productCount: number;
}

// Raw data returned by the compare-categories edge function (per category)
export interface CategoryResult {
  categoryId: number;
  categoryName: string;
  categoryPath: string;
  categoryRootId: number | null;
  categoryRootName: string | null;
  bestSellerAsin: string | null;
  bestSellerTitle: string | null;
  bestSellerRootCategoryId: number | null;
  bestSellerRootBsr: number | null;
}

// Frontend-computed opportunity (derived from CategoryResult + our product's BSR)
export interface CategoryOpportunity {
  categoryId: number;
  categoryName: string;
  categoryPath: string;
  categoryRootName: string | null;
  productCount: number;
  bestSellerAsin: string;
  bestSellerTitle: string;
  bestSellerRootBsr: number;
  ourBsr: number;
  sameRoot: boolean;   // categoryRootId === ourRootCategoryId
  bsrGap: number;      // bestSellerRootBsr - ourBsr (positive = we beat the best seller)
  winnable: boolean;   // sameRoot && bsrGap > 0
}

export const MARKETPLACES = [
  { code: "US", label: ".com (US)" },
  { code: "UK", label: ".co.uk (UK)" },
  { code: "DE", label: ".de (Germany)" },
  { code: "FR", label: ".fr (France)" },
  { code: "IT", label: ".it (Italy)" },
  { code: "ES", label: ".es (Spain)" },
  { code: "CA", label: ".ca (Canada)" },
  { code: "MX", label: ".com.mx (Mexico)" },
  { code: "AU", label: ".com.au (Australia)" },
  { code: "JP", label: ".co.jp (Japan)" },
  { code: "IN", label: ".in (India)" },
] as const;

export type MarketplaceCode = (typeof MARKETPLACES)[number]["code"];

export interface CategoryFitScore {
  categoryId: number;
  fitPercent: number;
  reason: string;
}

export interface SalesEstimates {
  [asin: string]: { monthlySales: number };
}
