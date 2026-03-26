import { useCallback, useMemo } from "react";
import DataEditor, {
  type GridCell,
  type GridColumn,
  GridCellKind,
  type Item,
  type EditableGridCell,
  type Theme,
  type CustomCell,
  type CustomRenderer,
  type ProvideEditorComponent,
} from "@glideapps/glide-data-grid";
import "@glideapps/glide-data-grid/dist/index.css";
import type { AggregatedCampaign, CampaignRules } from "../types";

// ---------------------------------------------------------------------------
// Dropdown custom cell
// ---------------------------------------------------------------------------

interface DropdownCellData {
  kind: "dropdown-cell";
  value: string;
  presets: readonly string[];
}

type DropdownCell = CustomCell<DropdownCellData>;

const DROPDOWN_PRESETS = ["3%", "5%", "6%", "10%"] as const;

const DropdownEditor: ProvideEditorComponent<DropdownCell> = ({ value: cell, onChange, onFinishedEditing }) => {
  const currentValue = cell.data.value;

  const handleSelect = (val: string) => {
    const next: DropdownCell = { ...cell, data: { ...cell.data, value: val } };
    onChange(next);
    onFinishedEditing(next);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", background: "white", minWidth: 100 }}>
      {cell.data.presets.map((preset) => (
        <button
          key={preset}
          onClick={() => handleSelect(preset)}
          style={{
            padding: "6px 12px",
            textAlign: "left",
            fontSize: 13,
            border: "none",
            background: preset === currentValue ? "#fefce8" : "white",
            fontWeight: preset === currentValue ? 600 : 400,
            cursor: "pointer",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "#f3f4f6"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = preset === currentValue ? "#fefce8" : "white"; }}
        >
          {preset}
        </button>
      ))}
      <div style={{ borderTop: "1px solid #e5e7eb", padding: "4px 8px" }}>
        <input
          autoFocus
          type="text"
          placeholder="Custom %"
          defaultValue={DROPDOWN_PRESETS.includes(currentValue as typeof DROPDOWN_PRESETS[number]) ? "" : currentValue}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSelect((e.target as HTMLInputElement).value);
            if (e.key === "Escape") onFinishedEditing();
          }}
          style={{ width: "100%", fontSize: 13, padding: "4px", border: "1px solid #d1d5db", borderRadius: 4, outline: "none" }}
        />
      </div>
    </div>
  );
};

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
    // Dropdown arrow
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

const customRenderers: CustomRenderer<DropdownCell>[] = [dropdownRenderer];

interface Props {
  campaigns: AggregatedCampaign[];
  rulesMap: Map<string, CampaignRules>;
  onRuleChanged: (campaignName: string, field: keyof CampaignRules, value: string | boolean) => void;
}

const THEME_30D: Partial<Theme> = { bgCell: "#eff6ff" };
const THEME_7D: Partial<Theme> = { bgCell: "#f0fdf4" };
const THEME_PAUSED: Partial<Theme> = { bgCell: "#f9fafb", textDark: "#9ca3af" };
const THEME_PAUSED_30D: Partial<Theme> = { bgCell: "#e8eff7", textDark: "#9ca3af" };
const THEME_PAUSED_7D: Partial<Theme> = { bgCell: "#e6f5ec", textDark: "#9ca3af" };
const THEME_DELTA_POSITIVE: Partial<Theme> = { textDark: "#16a34a" };
const THEME_DELTA_NEGATIVE: Partial<Theme> = { textDark: "#dc2626" };
const THEME_DELTA_POSITIVE_PAUSED: Partial<Theme> = { textDark: "#86efac", bgCell: "#f9fafb" };
const THEME_DELTA_NEGATIVE_PAUSED: Partial<Theme> = { textDark: "#fca5a5", bgCell: "#f9fafb" };
const THEME_RULE: Partial<Theme> = { bgCell: "#fefce8" }; // light yellow for rule columns

const DATA_COL_COUNT = 20;

const RULE_FIELDS: (keyof CampaignRules)[] = [
  "lowerBleeders",
  "lowerAcosThreshold",
  "increaseLowClicks",
  "increaseGoodAcos",
  "goodAcosCriteria",
  "newBudget",
  "pauseCampaign",
  "notes",
];

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
    // Rule columns
    { title: "Lower Bleeders", width: 110, group: "Rules" },
    { title: "Lower ACOS >", width: 100, group: "Rules" },
    { title: "Inc Low Clicks", width: 110, group: "Rules" },
    { title: "Inc Good ACOS", width: 110, group: "Rules" },
    { title: "Good ACOS <", width: 100, group: "Rules" },
    { title: "New Budget", width: 100, group: "Rules" },
    { title: "Pause", width: 70, group: "Rules" },
    { title: "Notes", width: 200, group: "Rules" },
  ];
}

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

function getCellTheme(col: number, isPaused: boolean): Partial<Theme> | undefined {
  if (COL_30D.has(col)) return isPaused ? THEME_PAUSED_30D : THEME_30D;
  if (COL_7D.has(col)) return isPaused ? THEME_PAUSED_7D : THEME_7D;
  if (isPaused) return THEME_PAUSED;
  return undefined;
}

function getDeltaTheme(value: number, isPaused: boolean): Partial<Theme> | undefined {
  if (value < 0) return isPaused ? THEME_DELTA_POSITIVE_PAUSED : THEME_DELTA_POSITIVE; // lower ACOS = good
  if (value > 0) return isPaused ? THEME_DELTA_NEGATIVE_PAUSED : THEME_DELTA_NEGATIVE; // higher ACOS = bad
  return isPaused ? THEME_PAUSED : undefined;
}

function getDataCellContent(c: AggregatedCampaign, col: number, paused: boolean): GridCell {
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

function getRuleCellContent(rules: CampaignRules, ruleIndex: number): GridCell {
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

function sortCampaigns(campaigns: AggregatedCampaign[]): AggregatedCampaign[] {
  return [...campaigns].sort((a, b) => {
    const portfolioCmp = a.portfolio.localeCompare(b.portfolio);
    if (portfolioCmp !== 0) return portfolioCmp;
    return b.sales30d - a.sales30d;
  });
}

export function CampaignGrid({ campaigns, rulesMap, onRuleChanged }: Props) {
  const sorted = useMemo(() => sortCampaigns(campaigns), [campaigns]);
  const columns = useMemo(() => buildColumns(campaigns.length), [campaigns.length]);

  const getCellContent = useCallback(
    ([col, row]: Item): GridCell => {
      const c = sorted[row];
      const paused = c.status === "PAUSED";

      if (col < DATA_COL_COUNT) {
        return getDataCellContent(c, col, paused);
      }

      const rules = rulesMap.get(c.campaignName);
      if (!rules) return textCell("");
      return getRuleCellContent(rules, col - DATA_COL_COUNT);
    },
    [sorted, rulesMap]
  );

  const onCellEdited = useCallback(
    ([col, row]: Item, newValue: EditableGridCell) => {
      if (col < DATA_COL_COUNT) return;

      const campaign = sorted[row];
      const field = RULE_FIELDS[col - DATA_COL_COUNT];

      if (newValue.kind === GridCellKind.Boolean) {
        onRuleChanged(campaign.campaignName, field, newValue.data ?? false);
      } else if (newValue.kind === GridCellKind.Text) {
        onRuleChanged(campaign.campaignName, field, newValue.data);
      } else if (newValue.kind === GridCellKind.Custom) {
        onRuleChanged(campaign.campaignName, field, (newValue as DropdownCell).data.value);
      }
    },
    [sorted, onRuleChanged]
  );

  return (
    <DataEditor
      columns={columns}
      rows={sorted.length}
      getCellContent={getCellContent}
      onCellEdited={onCellEdited}
      customRenderers={customRenderers}
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
