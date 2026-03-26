import DataEditor, {
  type GridCell,
  type GridColumn,
  GridCellKind,
  type Item,
} from "@glideapps/glide-data-grid";
import "@glideapps/glide-data-grid/dist/index.css";
import type { AggregatedCampaign } from "../types";

interface Props {
  campaigns: AggregatedCampaign[];
}

const columns: GridColumn[] = [
  { title: "Campaign", width: 260 },
  { title: "Status", width: 90 },
  { title: "Portfolio", width: 150 },
  { title: "Budget", width: 80 },
  { title: "Imp 30d", width: 90 },
  { title: "Imp 7d", width: 90 },
  { title: "Clicks 30d", width: 90 },
  { title: "Clicks 7d", width: 90 },
  { title: "Spend 30d", width: 95 },
  { title: "Spend 7d", width: 95 },
  { title: "Orders 30d", width: 90 },
  { title: "Orders 7d", width: 90 },
  { title: "Sales 30d", width: 95 },
  { title: "Sales 7d", width: 95 },
  { title: "ACOS 30d", width: 90 },
  { title: "ACOS 7d", width: 90 },
  { title: "ACOS \u0394", width: 90 },
  { title: "Yday Spend", width: 95 },
  { title: "DBY Spend", width: 95 },
  { title: "Budget \u26A0", width: 80 },
];

function textCell(text: string): GridCell {
  return { kind: GridCellKind.Text, data: text, displayData: text, allowOverlay: false };
}

function numberCell(value: number, prefix = ""): GridCell {
  const display = prefix + value.toLocaleString("en-US", { maximumFractionDigits: 2 });
  return { kind: GridCellKind.Number, data: value, displayData: display, allowOverlay: false };
}

function percentCell(value: number): GridCell {
  const display = value === 0 ? "0%" : value.toFixed(2) + "%";
  return { kind: GridCellKind.Number, data: value, displayData: display, allowOverlay: false };
}

function getCellContent(campaigns: AggregatedCampaign[], [col, row]: Item): GridCell {
  const c = campaigns[row];

  switch (col) {
    case 0: return textCell(c.campaignName);
    case 1: return textCell(c.status);
    case 2: return textCell(c.portfolio);
    case 3: return numberCell(c.budget, "$");
    case 4: return numberCell(c.impressions30d);
    case 5: return numberCell(c.impressions7d);
    case 6: return numberCell(c.clicks30d);
    case 7: return numberCell(c.clicks7d);
    case 8: return numberCell(c.spend30d, "$");
    case 9: return numberCell(c.spend7d, "$");
    case 10: return numberCell(c.orders30d);
    case 11: return numberCell(c.orders7d);
    case 12: return numberCell(c.sales30d, "$");
    case 13: return numberCell(c.sales7d, "$");
    case 14: return percentCell(c.acos30d);
    case 15: return percentCell(c.acos7d);
    case 16: return percentCell(c.acosDelta);
    case 17: return numberCell(c.spentYesterday, "$");
    case 18: return numberCell(c.spentDayBeforeYesterday, "$");
    case 19: return textCell(c.budgetCheck ? "\u26A0" : "");
    default: return textCell("");
  }
}

export function CampaignGrid({ campaigns }: Props) {
  return (
    <div style={{ height: "calc(100vh - 140px)" }}>
      <DataEditor
        columns={columns}
        rows={campaigns.length}
        getCellContent={(item) => getCellContent(campaigns, item)}
        width="100%"
        height="100%"
        smoothScrollX
        smoothScrollY
        getCellsForSelection
        copyHeaders
        freezeColumns={1}
      />
    </div>
  );
}
