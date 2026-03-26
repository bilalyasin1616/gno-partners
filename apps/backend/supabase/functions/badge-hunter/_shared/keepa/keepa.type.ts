// ── Keepa product endpoint ──────────────────────────────────────────

export interface KeepaProduct {
  asin: string;
  title?: string;
  description?: string;
  parentAsin?: string;
  categoryTree?: { catId: number; name: string }[];
  rootCategory?: number;
  salesRanks?: Record<string, number[]>;
  imagesCSV?: string;
  variations?: KeepaVariation[];
  bulletPoints?: string[];
}

export interface KeepaVariation {
  asin: string;
  attributes?: { dimension: string; value: string }[];
}

export interface KeepaProductResponse {
  products: KeepaProduct[];
}

// ── Keepa category endpoint ─────────────────────────────────────────

export interface KeepaCategory {
  catId: number;
  name: string;
  children: number[] | null;
  parent: number;
  productCount: number;
}

export interface KeepaCategoryResponse {
  categories: Record<string, KeepaCategory>;
}

// ── Keepa search endpoint ───────────────────────────────────────────

export interface KeepaSearchCategory {
  catId: number;
  name: string;
  lowestRank: number;
  highestRank: number;
  productCount: number;
}

export interface KeepaSearchResponse {
  categories: Record<string, KeepaSearchCategory>;
}

// ── Keepa bestsellers endpoint ──────────────────────────────────────

export interface KeepaBestSellerList {
  asinList: string[];
  categoryId: number;
  domainId: number;
  lastUpdate: number;
}

export interface KeepaBestSellerResponse {
  bestSellersList: KeepaBestSellerList | null;
}
