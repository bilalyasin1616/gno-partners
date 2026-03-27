import { useCallback, useMemo } from "react";
import DataEditor, { GridCellKind, type GridCell, type Item, type EditableGridCell } from "@glideapps/glide-data-grid";
import "@glideapps/glide-data-grid/dist/index.css";
import type { CampaignGridProps, DropdownCell } from "./types";
import { buildColumns, DATA_COL_COUNT } from "./columns";
import { getDataCellContent, getRuleCellContent, sortCampaigns, textCell } from "./cells";
import { RULE_FIELDS, customRenderers } from "./constants";

export function CampaignGrid({ campaigns, rulesMap, onRuleChanged }: CampaignGridProps) {
  const sorted = useMemo(() => sortCampaigns(campaigns), [campaigns]);
  const columns = useMemo(() => buildColumns(campaigns.length), [campaigns.length]);

  const getCellContent = useCallback(
    ([colIndex, rowIndex]: Item): GridCell => {
      const campaign = sorted[rowIndex];
      const isPaused = campaign.status === "PAUSED";

      if (colIndex < DATA_COL_COUNT) return getDataCellContent(campaign, colIndex, isPaused);

      const rules = rulesMap.get(campaign.campaignName);
      if (!rules) return textCell("");
      return getRuleCellContent(rules, colIndex - DATA_COL_COUNT);
    },
    [sorted, rulesMap]
  );

  const onCellEdited = useCallback(
    ([colIndex, rowIndex]: Item, newValue: EditableGridCell) => {
      if (colIndex < DATA_COL_COUNT) return;

      const campaign = sorted[rowIndex];
      const field = RULE_FIELDS[colIndex - DATA_COL_COUNT];

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
