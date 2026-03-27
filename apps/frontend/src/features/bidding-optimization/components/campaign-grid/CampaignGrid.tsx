import { useCallback, useMemo, useState } from "react";
import DataEditor, {
  GridCellKind,
  type GridCell,
  type GridColumn,
  type Item,
  type EditableGridCell,
  type DrawHeaderCallback,
} from "@glideapps/glide-data-grid";
import "@glideapps/glide-data-grid/dist/index.css";
import type { CampaignGridProps, DropdownCell, SortEntry } from "./types";
import { buildColumns, DATA_COL_COUNT } from "./columns";
import { getDataCellContent, getRuleCellContent, textCell } from "./cells";
import { RULE_FIELDS, customRenderers, DEFAULT_SORT } from "./constants";
import { multiSort, drawSortArrow, getArrowPosition } from "./sorting";

export function CampaignGrid({ campaigns, rulesMap, onRuleChanged }: CampaignGridProps) {
  const [sortEntries, setSortEntries] = useState<SortEntry[]>(DEFAULT_SORT);
  const [columnWidths, setColumnWidths] = useState<Map<number, number>>(new Map());

  const sortMap = useMemo(() => {
    const map = new Map<number, SortEntry>();
    for (const entry of sortEntries) map.set(entry.colIndex, entry);
    return map;
  }, [sortEntries]);

  const sorted = useMemo(
    () => [...campaigns].sort((a, b) => multiSort(a, b, sortEntries)),
    [campaigns, sortEntries]
  );

  const columns = useMemo(() => {
    const cols = buildColumns(campaigns.length);
    return cols.map((col, i) => {
      const customWidth = columnWidths.get(i);
      return customWidth ? { ...col, width: customWidth } : col;
    });
  }, [campaigns.length, columnWidths]);

  const drawHeader: DrawHeaderCallback = useCallback(
    (args, drawContent) => {
      drawContent();
      const entry = sortMap.get(args.columnIndex);
      if (entry) {
        const { x, y } = getArrowPosition(args.rect);
        drawSortArrow(args.ctx, x, y, entry.direction, args.theme.textHeader);
      }
    },
    [sortMap]
  );

  const getCellContent = useCallback(
    ([colIndex, rowIndex]: Item): GridCell => {
      const campaign = sorted[rowIndex];
      if (colIndex < DATA_COL_COUNT) return getDataCellContent(campaign, colIndex);
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

  const onHeaderClicked = useCallback(
    (colIndex: number, event: { shiftKey?: boolean }) => {
      if (colIndex >= DATA_COL_COUNT) return;

      setSortEntries((prev) => {
        const existing = prev.find((e) => e.colIndex === colIndex);

        if (event.shiftKey) {
          if (existing) {
            if (existing.direction === "asc") {
              return prev.map((e) => e.colIndex === colIndex ? { ...e, direction: "desc" as const } : e);
            }
            const filtered = prev.filter((e) => e.colIndex !== colIndex);
            return filtered.length > 0 ? filtered : DEFAULT_SORT;
          }
          return [...prev, { colIndex, direction: "asc" as const }];
        }

        if (existing && prev.length === 1) {
          if (existing.direction === "asc") return [{ colIndex, direction: "desc" }];
          return DEFAULT_SORT;
        }
        return [{ colIndex, direction: "asc" }];
      });
    },
    []
  );

  const onColumnResize = useCallback(
    (_col: GridColumn, newSize: number, colIndex: number) => {
      setColumnWidths((prev) => new Map(prev).set(colIndex, newSize));
    },
    []
  );

  return (
    <DataEditor
      columns={columns}
      rows={sorted.length}
      getCellContent={getCellContent}
      onCellEdited={onCellEdited}
      onHeaderClicked={onHeaderClicked}
      onColumnResize={onColumnResize}
      drawHeader={drawHeader}
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
