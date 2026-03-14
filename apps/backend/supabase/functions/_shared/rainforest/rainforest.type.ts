export interface SalesEstimateResult {
  monthlySales: number;
}

export interface RainforestSalesEstimation {
  has_sales_estimation: boolean;
  monthly_sales_estimate: number | null;
  weekly_sales_estimate: number | null;
  bestseller_rank: number | null;
  sales_estimation_category: string | null;
}

export interface RainforestSalesResponse {
  sales_estimation?: RainforestSalesEstimation;
}

export interface RainforestSearchResult {
  asin: string;
  title?: string;
}

export interface RainforestSearchResponse {
  search_results?: RainforestSearchResult[];
}
