import { GridCellKind, type GridCell, type Theme } from "@glideapps/glide-data-grid";
import type { AggregatedCampaign, CampaignRules } from "../../types";
import type { DropdownCell } from "./types";
import { DATA_COLUMNS, type CellFormat } from "./columns";
import { THEME_RULE, getCellTheme, getDeltaTheme } from "./themes";
import { DROPDOWN_PRESETS, RULE_FIELDS } from "./constants";

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

function formatCell(value: unknown, format: CellFormat, theme?: Partial<Theme>): GridCell {
  switch (format) {
    case "text": return textCell(String(value ?? ""), theme);
    case "number": return numberCell(value as number, "", theme);
    case "currency": return numberCell(value as number, "$", theme);
    case "percent": return percentCell(value as number, theme);
    case "budgetCheck": return textCell((value as boolean) ? "\u26A0" : "", theme);
  }
}

function editableTextCell(text: string, suffix = "", prefix = ""): GridCell {
  const display = text ? `${prefix}${text}${suffix}` : "";
  return { kind: GridCellKind.Text, data: text, displayData: display, allowOverlay: true, readonly: false, themeOverride: THEME_RULE };
}

function dropdownCell(value: string): DropdownCell {
  return {
    kind: GridCellKind.Custom,
    data: { kind: "dropdown-cell", value, presets: DROPDOWN_PRESETS },
    allowOverlay: true,
    copyData: value,
    themeOverride: THEME_RULE,
  };
}

function checkboxCell(checked: boolean): GridCell {
  return { kind: GridCellKind.Boolean, data: checked, allowOverlay: false, themeOverride: THEME_RULE };
}

export function getDataCellContent(campaign: AggregatedCampaign, colIndex: number, isPaused: boolean): GridCell {
  const col = DATA_COLUMNS[colIndex];
  const value = campaign[col.field];

  const isAcosDelta = col.field === "acosDelta";
  const theme = isAcosDelta
    ? getDeltaTheme(value as number, isPaused)
    : getCellTheme(col.period, isPaused);

  return formatCell(value, col.format, theme);
}

export function getRuleCellContent(rules: CampaignRules, ruleIndex: number): GridCell {
  const field = RULE_FIELDS[ruleIndex];
  switch (field) {
    case "lowerBleeders":
    case "pauseCampaign":
      return checkboxCell(rules[field] as boolean);
    case "increaseLowClicks":
    case "increaseGoodAcos":
      return dropdownCell(rules[field] as string);
    case "lowerAcosThreshold":
    case "goodAcosCriteria":
      return editableTextCell(rules[field] as string, "%");
    case "newBudget":
      return editableTextCell(rules[field] as string, "", "$");
    default:
      return editableTextCell(rules[field] as string);
  }
}

export function sortCampaigns(campaigns: AggregatedCampaign[]): AggregatedCampaign[] {
  return [...campaigns].sort((a, b) => {
    const portfolioCmp = a.portfolio.localeCompare(b.portfolio);
    if (portfolioCmp !== 0) return portfolioCmp;
    return b.sales30d - a.sales30d;
  });
}

// Re-export for tests
export { textCell, numberCell, percentCell, editableTextCell, checkboxCell };
