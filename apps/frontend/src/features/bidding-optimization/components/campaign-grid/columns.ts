import type { GridColumn } from "@glideapps/glide-data-grid";
import type { AggregatedCampaign } from "../../types";

export type CellFormat = "text" | "number" | "currency" | "percent" | "budgetCheck";
export type Period = "30d" | "7d" | undefined;

export interface DataColumnDef {
  id: string;
  field: keyof AggregatedCampaign;
  title: string;
  width: number;
  group: string;
  format: CellFormat;
  period?: Period;
}

export const DATA_COLUMNS: DataColumnDef[] = [
  { id: "campaignName", field: "campaignName", title: "Campaigns", width: 260, group: "Info", format: "text" },
  { id: "portfolio", field: "portfolio", title: "Portfolio", width: 150, group: "Info", format: "text" },
  { id: "budget", field: "budget", title: "Budget", width: 80, group: "Info", format: "currency" },
  // Last 30 Days
  { id: "impressions30d", field: "impressions30d", title: "Impressions", width: 95, group: "Last 30 Days", format: "number", period: "30d" },
  { id: "clicks30d", field: "clicks30d", title: "Clicks", width: 80, group: "Last 30 Days", format: "number", period: "30d" },
  { id: "spend30d", field: "spend30d", title: "Spend", width: 90, group: "Last 30 Days", format: "currency", period: "30d" },
  { id: "orders30d", field: "orders30d", title: "Orders", width: 80, group: "Last 30 Days", format: "number", period: "30d" },
  { id: "sales30d", field: "sales30d", title: "Sales", width: 90, group: "Last 30 Days", format: "currency", period: "30d" },
  { id: "acos30d", field: "acos30d", title: "ACOS", width: 80, group: "Last 30 Days", format: "percent", period: "30d" },
  // Last 7 Days
  { id: "impressions7d", field: "impressions7d", title: "Impressions", width: 95, group: "Last 7 Days", format: "number", period: "7d" },
  { id: "clicks7d", field: "clicks7d", title: "Clicks", width: 80, group: "Last 7 Days", format: "number", period: "7d" },
  { id: "spend7d", field: "spend7d", title: "Spend", width: 90, group: "Last 7 Days", format: "currency", period: "7d" },
  { id: "orders7d", field: "orders7d", title: "Orders", width: 80, group: "Last 7 Days", format: "number", period: "7d" },
  { id: "sales7d", field: "sales7d", title: "Sales", width: 90, group: "Last 7 Days", format: "currency", period: "7d" },
  { id: "acos7d", field: "acos7d", title: "ACOS", width: 80, group: "Last 7 Days", format: "percent", period: "7d" },
  // Trend & Recent
  { id: "acosDelta", field: "acosDelta", title: "ACOS \u0394", width: 90, group: "Trend", format: "percent" },
  { id: "spentYesterday", field: "spentYesterday", title: "Yday Spend", width: 95, group: "Recent", format: "currency" },
  { id: "spentDayBeforeYesterday", field: "spentDayBeforeYesterday", title: "DBY Spend", width: 95, group: "Recent", format: "currency" },
  { id: "budgetCheck", field: "budgetCheck", title: "Budget \u26A0", width: 80, group: "Recent", format: "budgetCheck" },
];

export const DATA_COL_COUNT = DATA_COLUMNS.length;

const RULE_COLUMNS: GridColumn[] = [
  { title: "Lower Bleeders", width: 110, group: "Rules" },
  { title: "Lower ACOS >", width: 100, group: "Rules" },
  { title: "Inc Low Clicks", width: 110, group: "Rules" },
  { title: "Inc Good ACOS", width: 110, group: "Rules" },
  { title: "Good ACOS <", width: 100, group: "Rules" },
  { title: "New Budget", width: 100, group: "Rules" },
  { title: "Pause", width: 70, group: "Rules" },
  { title: "Notes", width: 200, group: "Rules" },
];

export function buildColumns(campaignCount: number): GridColumn[] {
  const dataColumns: GridColumn[] = DATA_COLUMNS.map((col, i) => ({
    id: col.id,
    title: i === 0 ? `${col.title} (${campaignCount})` : col.title,
    width: col.width,
    group: col.group,
  }));
  return [...dataColumns, ...RULE_COLUMNS];
}
