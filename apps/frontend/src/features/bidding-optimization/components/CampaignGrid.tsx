import { useMemo } from "react";
import DataEditor, {
  type GridCell,
  type GridColumn,
  GridCellKind,
  type Item,
  type Theme,
} from "@glideapps/glide-data-grid";
import "@glideapps/glide-data-grid/dist/index.css";
import type { AggregatedCampaign } from "../types";

interface Props {
  campaigns: AggregatedCampaign[];
}

const THEME_30D: Partial<Theme> = { bgCell: "#eff6ff" }; // light blue
const THEME_7D: Partial<Theme> = { bgCell: "#f0fdf4" }; // light green
const THEME_PAUSED: Partial<Theme> = { bgCell: "#f9fafb", textDark: "#9ca3af" };
const THEME_PAUSED_30D: Partial<Theme> = { bgCell: "#e8eff7", textDark: "#9ca3af" };
const THEME_PAUSED_7D: Partial<Theme> = { bgCell: "#e6f5ec", textDark: "#9ca3af" };
const THEME_DELTA_POSITIVE: Partial<Theme> = { textDark: "#16a34a" };
const THEME_DELTA_NEGATIVE: Partial<Theme> = { textDark: "#dc2626" };
const THEME_DELTA_POSITIVE_PAUSED: Partial<Theme> = { textDark: "#86efac", bgCell: "#f9fafb" };
const THEME_DELTA_NEGATIVE_PAUSED: Partial<Theme> = { textDark: "#fca5a5", bgCell: "#f9fafb" };

function buildColumns(count: number): GridColumn[] {
  return [
    { title: `Campaigns (${count})`, width: 260, group: "Info" },
    { title: "Status", width: 90, group: "Info" },
    { title: "Portfolio", width: 150, group: "Info" },
    { title: "Budget", width: 80, group: "Info" },
    { title: "Imp 30d", width: 90, group: "Impressions" },
    { title: "Imp 7d", width: 90, group: "Impressions" },
    { title: "Clicks 30d", width: 90, group: "Clicks" },
    { title: "Clicks 7d", width: 90, group: "Clicks" },
    { title: "Spend 30d", width: 95, group: "Spend" },
    { title: "Spend 7d", width: 95, group: "Spend" },
    { title: "Orders 30d", width: 90, group: "Orders" },
    { title: "Orders 7d", width: 90, group: "Orders" },
    { title: "Sales 30d", width: 95, group: "Sales" },
    { title: "Sales 7d", width: 95, group: "Sales" },
    { title: "ACOS 30d", width: 90, group: "ACOS" },
    { title: "ACOS 7d", width: 90, group: "ACOS" },
    { title: "ACOS \u0394", width: 90, group: "Trend" },
    { title: "Yday Spend", width: 95, group: "Recent" },
    { title: "DBY Spend", width: 95, group: "Recent" },
    { title: "Budget \u26A0", width: 80, group: "Recent" },
  ];
}

// Column indices for 30d (even in each metric pair) and 7d (odd)
const COL_30D = new Set([4, 6, 8, 10, 12, 14]);
const COL_7D = new Set([5, 7, 9, 11, 13, 15]);

function textCell(text: string, theme?: Partial<Theme>): GridCell {
  return { kind: GridCellKind.Text, data: text, displayData: text, allowOverlay: false, themeOverride: theme };
}

function numberCell(value: number, prefix = "", theme?: Partial<Theme>): GridCell {
  const display = prefix + value.toLocaleString("en-US", { maximumFractionDigits: 2 });
  return { kind: GridCellKind.Number, data: value, displayData: display, allowOverlay: false, themeOverride: theme };
}

function percentCell(value: number, theme?: Partial<Theme>): GridCell {
  const display = value === 0 ? "0%" : value.toFixed(2) + "%";
  return { kind: GridCellKind.Number, data: value, displayData: display, allowOverlay: false, themeOverride: theme };
}

function getCellTheme(col: number, isPaused: boolean): Partial<Theme> | undefined {
  if (COL_30D.has(col)) return isPaused ? THEME_PAUSED_30D : THEME_30D;
  if (COL_7D.has(col)) return isPaused ? THEME_PAUSED_7D : THEME_7D;
  if (isPaused) return THEME_PAUSED;
  return undefined;
}

function getDeltaTheme(value: number, isPaused: boolean): Partial<Theme> | undefined {
  if (value > 0) return isPaused ? THEME_DELTA_POSITIVE_PAUSED : THEME_DELTA_POSITIVE;
  if (value < 0) return isPaused ? THEME_DELTA_NEGATIVE_PAUSED : THEME_DELTA_NEGATIVE;
  return isPaused ? THEME_PAUSED : undefined;
}

function getCellContent(campaigns: AggregatedCampaign[], [col, row]: Item): GridCell {
  const c = campaigns[row];
  const paused = c.status === "PAUSED";
  const theme = getCellTheme(col, paused);

  switch (col) {
    case 0: return textCell(c.campaignName, theme);
    case 1: return textCell(c.status, theme);
    case 2: return textCell(c.portfolio, theme);
    case 3: return numberCell(c.budget, "$", theme);
    case 4: return numberCell(c.impressions30d, "", theme);
    case 5: return numberCell(c.impressions7d, "", theme);
    case 6: return numberCell(c.clicks30d, "", theme);
    case 7: return numberCell(c.clicks7d, "", theme);
    case 8: return numberCell(c.spend30d, "$", theme);
    case 9: return numberCell(c.spend7d, "$", theme);
    case 10: return numberCell(c.orders30d, "", theme);
    case 11: return numberCell(c.orders7d, "", theme);
    case 12: return numberCell(c.sales30d, "$", theme);
    case 13: return numberCell(c.sales7d, "$", theme);
    case 14: return percentCell(c.acos30d, theme);
    case 15: return percentCell(c.acos7d, theme);
    case 16: return percentCell(c.acosDelta, getDeltaTheme(c.acosDelta, paused));
    case 17: return numberCell(c.spentYesterday, "$", paused ? THEME_PAUSED : undefined);
    case 18: return numberCell(c.spentDayBeforeYesterday, "$", paused ? THEME_PAUSED : undefined);
    case 19: return textCell(c.budgetCheck ? "\u26A0" : "", paused ? THEME_PAUSED : undefined);
    default: return textCell("");
  }
}

function sortCampaigns(campaigns: AggregatedCampaign[]): AggregatedCampaign[] {
  return [...campaigns].sort((a, b) => {
    const portfolioCmp = a.portfolio.localeCompare(b.portfolio);
    if (portfolioCmp !== 0) return portfolioCmp;
    return b.sales30d - a.sales30d;
  });
}

export function CampaignGrid({ campaigns }: Props) {
  const sorted = useMemo(() => sortCampaigns(campaigns), [campaigns]);
  const columns = useMemo(() => buildColumns(campaigns.length), [campaigns.length]);

  return (
    <DataEditor
      columns={columns}
      rows={sorted.length}
      getCellContent={(item) => getCellContent(sorted, item)}
      width="100%"
      height="100%"
      smoothScrollX
      smoothScrollY
      getCellsForSelection
      copyHeaders
      freezeColumns={1}
    />
  );
}
