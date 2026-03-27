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

const THEME_DISABLED: Partial<Theme> = { bgCell: "#f3f4f6", textDark: "#9ca3af" };
const THEME_REQUIRED: Partial<Theme> = { bgCell: "#fee2e2", textDark: "#dc2626", borderColor: "#f87171" };

function editableTextCell(text: string, suffix = "", prefix = ""): GridCell {
  const display = text ? `${prefix}${text}${suffix}` : "";
  return { kind: GridCellKind.Text, data: text, displayData: display, allowOverlay: true, readonly: false, themeOverride: THEME_RULE };
}

function requiredTextCell(text: string, suffix = ""): GridCell {
  const display = text ? `${text}${suffix}` : "";
  return { kind: GridCellKind.Text, data: text, displayData: display, allowOverlay: true, readonly: false, themeOverride: THEME_REQUIRED };
}

function disabledTextCell(): GridCell {
  return { kind: GridCellKind.Text, data: "", displayData: "", allowOverlay: false, themeOverride: THEME_DISABLED };
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

export function getDataCellContent(campaign: AggregatedCampaign, colIndex: number): GridCell {
  const col = DATA_COLUMNS[colIndex];
  const value = campaign[col.field];

  const theme = col.field === "acosDelta"
    ? getDeltaTheme(value as number)
    : getCellTheme(col.period);

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
      return editableTextCell(rules[field] as string, "%");
    case "goodAcosCriteria":
      if (!rules.increaseGoodAcos) return disabledTextCell();
      if (!rules.goodAcosCriteria) return requiredTextCell("", "%");
      return editableTextCell(rules[field] as string, "%");
    case "newBudget":
      return editableTextCell(rules[field] as string, "", "$");
    default:
      return editableTextCell(rules[field] as string);
  }
}

// Re-export for tests
export { textCell, numberCell, percentCell, editableTextCell, checkboxCell };
