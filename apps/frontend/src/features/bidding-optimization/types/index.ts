/** A single daily row parsed from the Amazon SP Campaign Report CSV. */
export interface CSVRow {
  date: string;
  portfolioName: string;
  campaignName: string;
  status: string;
  budgetAmount: number;
  impressions: number;
  clicks: number;
  spend: number;
  orders: number;
  sales: number;
}

/** Aggregated campaign data ready for display in the grid. */
export interface AggregatedCampaign {
  campaignName: string;
  status: string;
  portfolio: string;
  budget: number;

  impressions30d: number;
  impressions7d: number;
  clicks30d: number;
  clicks7d: number;
  spend30d: number;
  spend7d: number;
  orders30d: number;
  orders7d: number;
  sales30d: number;
  sales7d: number;
  acos30d: number;
  acos7d: number;

  /** ((7d ACOS - 30d ACOS) / 30d ACOS) * 100 */
  acosDelta: number;

  spentYesterday: number;
  spentDayBeforeYesterday: number;

  /** true when yesterday spend >= 90% of budget */
  budgetCheck: boolean;
}
