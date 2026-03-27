import { GridCellKind, type CustomCell, type CustomRenderer } from "@glideapps/glide-data-grid";
import type { CampaignRules } from "../../types";
import type { DropdownCell, DropdownCellData, SortEntry } from "./types";
import { DropdownEditor } from "./DropdownEditor";

export const DEFAULT_SORT: SortEntry[] = [
  { colIndex: 1, direction: "desc" },  // portfolio
  { colIndex: 7, direction: "desc" },  // sales30d
];

export const DROPDOWN_PRESETS = ["3%", "5%", "6%", "10%"] as const;

export const RULE_FIELDS: (keyof CampaignRules)[] = [
  "lowerBleeders",
  "lowerAcosThreshold",
  "increaseLowClicks",
  "increaseGoodAcos",
  "goodAcosCriteria",
  "newBudget",
  "pauseCampaign",
  "notes",
];

const dropdownRenderer: CustomRenderer<DropdownCell> = {
  kind: GridCellKind.Custom,
  isMatch: (cell: CustomCell): cell is DropdownCell =>
    (cell.data as DropdownCellData).kind === "dropdown-cell",
  draw: (args, cell) => {
    const { ctx, rect, theme } = args;
    const text = cell.data.value || "";
    ctx.fillStyle = theme.textDark;
    ctx.font = `13px ${theme.fontFamily}`;
    ctx.fillText(text, rect.x + 8, rect.y + rect.height / 2 + 4);
    const arrowX = rect.x + rect.width - 18;
    const arrowY = rect.y + rect.height / 2;
    ctx.fillStyle = "#9ca3af";
    ctx.beginPath();
    ctx.moveTo(arrowX, arrowY - 3);
    ctx.lineTo(arrowX + 6, arrowY - 3);
    ctx.lineTo(arrowX + 3, arrowY + 3);
    ctx.closePath();
    ctx.fill();
    return true;
  },
  provideEditor: () => ({
    editor: DropdownEditor,
    disablePadding: true,
    disableStyling: true,
  }),
};

export const customRenderers: CustomRenderer<DropdownCell>[] = [dropdownRenderer];
