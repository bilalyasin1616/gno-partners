import * as XLSX from 'xlsx';
import type { CampaignRules, BulkOperationRow } from '../types';
import { applyRulesToRow, roundBid } from './rule-engine';

const SP_TAB = "Sponsored Products Campaigns";

interface ColumnMap {
  entity: number;
  campaignName: number;
  operation: number;
  state: number;
  dailyBudget: number;
  bid: number;
  clicks: number;
  orders: number;
  acos: number;
}

function findColumns(header: string[]): ColumnMap {
  const find = (name: string) => {
    const idx = header.indexOf(name);
    if (idx === -1) throw new Error(`Column "${name}" not found in bulk sheet`);
    return idx;
  };

  return {
    entity: find("Entity"),
    campaignName: find("Campaign Name"),
    operation: find("Operation"),
    state: find("State"),
    dailyBudget: find("Daily Budget"),
    bid: find("Bid"),
    clicks: find("Clicks"),
    orders: find("Orders"),
    acos: find("ACOS"),
  };
}

function getCampaignNameForRow(row: (string | number | null)[], cols: ColumnMap, rows: (string | number | null)[][], rowIndex: number): string {
  const direct = row[cols.campaignName];
  if (direct) return String(direct);

  // Walk backwards to find the parent Campaign row
  for (let i = rowIndex - 1; i >= 0; i--) {
    const entity = rows[i][cols.entity];
    if (entity === "Campaign") return String(rows[i][cols.campaignName] ?? "");
  }
  return "";
}

export function applyRulesToBulkSheet(
  xlsxBuffer: ArrayBuffer,
  rulesMap: Map<string, CampaignRules>
): { blob: Blob; modifiedCount: number } {
  const workbook = XLSX.read(xlsxBuffer, { type: "array", sheets: [SP_TAB] });
  const sheet = workbook.Sheets[SP_TAB];
  if (!sheet) throw new Error(`Tab "${SP_TAB}" not found in the uploaded file`);

  const data = XLSX.utils.sheet_to_json<(string | number | null)[]>(sheet, { header: 1 });
  if (data.length < 2) throw new Error("Bulk sheet has no data rows");

  const header = data[0].map(String);
  const cols = findColumns(header);

  let modifiedCount = 0;

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (!row || row.length === 0) continue;

    const entity = String(row[cols.entity] ?? "");
    if (!entity) continue;

    const campaignName = getCampaignNameForRow(row, cols, data, i);
    const rules = rulesMap.get(campaignName);
    if (!rules) continue;

    const targetRow: BulkOperationRow = {
      entity,
      bid: Number(row[cols.bid] ?? 0),
      clicks: Number(row[cols.clicks] ?? 0),
      orders: Number(row[cols.orders] ?? 0),
      acos: Number(row[cols.acos] ?? 0),
      state: String(row[cols.state] ?? "enabled"),
      dailyBudget: row[cols.dailyBudget] != null ? Number(row[cols.dailyBudget]) : undefined,
    };

    const result = applyRulesToRow(targetRow, rules);
    if (!result.modified) continue;

    modifiedCount++;
    row[cols.operation] = "Update";

    if (result.state !== targetRow.state) row[cols.state] = result.state;
    if (result.bid !== targetRow.bid) row[cols.bid] = roundBid(result.bid);
    if (result.dailyBudget !== targetRow.dailyBudget && result.dailyBudget != null) {
      row[cols.dailyBudget] = result.dailyBudget;
    }
  }

  // Only include header + modified rows
  const modifiedRows = data.filter((row, i) => i > 0 && row[cols.operation] === "Update");
  const outputData = [data[0], ...modifiedRows];

  const newSheet = XLSX.utils.aoa_to_sheet(outputData);
  const outputWorkbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(outputWorkbook, newSheet, SP_TAB);
  const output = XLSX.write(outputWorkbook, { type: "array", bookType: "xlsx" });
  const blob = new Blob([output], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

  return { blob, modifiedCount };
}
