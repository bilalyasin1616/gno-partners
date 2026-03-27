import type { GridColumn } from "@glideapps/glide-data-grid";
import type { AggregatedCampaign } from "../../types";

export type CellFormat = "text" | "number" | "currency" | "percent" | "budgetCheck";
export type Period = "30d" | "7d" | undefined;

export interface DataColumnDef {
  field: keyof AggregatedCampaign;
  title: string;
  width: number;
  group: string;
  format: CellFormat;
  period?: Period;
}

export const DATA_COLUMNS: DataColumnDef[] = [
  { field: "campaignName", title: "Campaigns", width: 260, group: "Info", format: "text" },
  { field: "status", title: "Status", width: 90, group: "Info", format: "text" },
  { field: "portfolio", title: "Portfolio", width: 150, group: "Info", format: "text" },
  { field: "budget", title: "Budget", width: 80, group: "Info", format: "currency" },
  { field: "impressions30d", title: "Imp 30d", width: 90, group: "Impressions", format: "number", period: "30d" },
  { field: "impressions7d", title: "Imp 7d", width: 90, group: "Impressions", format: "number", period: "7d" },
  { field: "clicks30d", title: "Clicks 30d", width: 90, group: "Clicks", format: "number", period: "30d" },
  { field: "clicks7d", title: "Clicks 7d", width: 90, group: "Clicks", format: "number", period: "7d" },
  { field: "spend30d", title: "Spend 30d", width: 95, group: "Spend", format: "currency", period: "30d" },
  { field: "spend7d", title: "Spend 7d", width: 95, group: "Spend", format: "currency", period: "7d" },
  { field: "orders30d", title: "Orders 30d", width: 90, group: "Orders", format: "number", period: "30d" },
  { field: "orders7d", title: "Orders 7d", width: 90, group: "Orders", format: "number", period: "7d" },
  { field: "sales30d", title: "Sales 30d", width: 95, group: "Sales", format: "currency", period: "30d" },
  { field: "sales7d", title: "Sales 7d", width: 95, group: "Sales", format: "currency", period: "7d" },
  { field: "acos30d", title: "ACOS 30d", width: 90, group: "ACOS", format: "percent", period: "30d" },
  { field: "acos7d", title: "ACOS 7d", width: 90, group: "ACOS", format: "percent", period: "7d" },
  { field: "acosDelta", title: "ACOS \u0394", width: 90, group: "Trend", format: "percent" },
  { field: "spentYesterday", title: "Yday Spend", width: 95, group: "Recent", format: "currency" },
  { field: "spentDayBeforeYesterday", title: "DBY Spend", width: 95, group: "Recent", format: "currency" },
  { field: "budgetCheck", title: "Budget \u26A0", width: 80, group: "Recent", format: "budgetCheck" },
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
  const dataColumns = DATA_COLUMNS.map((col, i) => ({
    title: i === 0 ? `${col.title} (${campaignCount})` : col.title,
    width: col.width,
    group: col.group,
  }));
  return [...dataColumns, ...RULE_COLUMNS];
}
