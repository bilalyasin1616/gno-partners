import type { CustomCell } from "@glideapps/glide-data-grid";
import type { AggregatedCampaign, CampaignRules } from "../../types";

export interface DropdownCellData {
  kind: "dropdown-cell";
  value: string;
  presets: readonly string[];
}

export type DropdownCell = CustomCell<DropdownCellData>;

export interface SortEntry {
  colIndex: number;
  direction: "asc" | "desc";
}

export interface CampaignGridProps {
  campaigns: AggregatedCampaign[];
  rulesMap: Map<string, CampaignRules>;
  onRuleChanged: (campaignName: string, field: keyof CampaignRules, value: string | boolean) => void;
}
