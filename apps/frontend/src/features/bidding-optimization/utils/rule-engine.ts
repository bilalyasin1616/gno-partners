import type { CampaignRules, BulkOperationRow, BulkOperationRowResult } from '../types';

const BLEEDER_LOW_THRESHOLD = 6;
const BLEEDER_MID_THRESHOLD = 8;
const BLEEDER_HIGH_THRESHOLD = 15;
const BLEEDER_LOW_REDUCTION = 0.05;
const BLEEDER_MID_REDUCTION = 0.10;
const BID_DECIMAL_PLACES = 2;

function isBiddableEntity(entity: string): boolean {
  return entity === "Keyword" || entity === "Product Targeting";
}

function applyBleeders(row: BulkOperationRow, result: BulkOperationRowResult): void {
  if (!isBiddableEntity(row.entity) || row.orders > 0) return;

  if (row.clicks >= BLEEDER_HIGH_THRESHOLD) {
    result.state = "paused";
    result.modified = true;
  } else if (row.clicks >= BLEEDER_MID_THRESHOLD) {
    result.bid = row.bid * (1 - BLEEDER_MID_REDUCTION);
    result.modified = true;
  } else if (row.clicks >= BLEEDER_LOW_THRESHOLD) {
    result.bid = row.bid * (1 - BLEEDER_LOW_REDUCTION);
    result.modified = true;
  }
}

function reduceBidForHighAcos(row: BulkOperationRow, result: BulkOperationRowResult, threshold: number): void {
  if (!isBiddableEntity(row.entity) || row.orders === 0) return;

  const acosPercent = row.acos * 100;
  if (acosPercent > threshold) {
    const delta = acosPercent - threshold;
    result.bid = row.bid * (1 - delta / 100);
    result.modified = true;
  }
}

function increaseBidForLowClicks(row: BulkOperationRow, result: BulkOperationRowResult, percentage: number): void {
  if (!isBiddableEntity(row.entity) || row.clicks > 1) return;

  result.bid = row.bid * (1 + percentage / 100);
  result.modified = true;
}

function increaseBidForGoodAcos(row: BulkOperationRow, result: BulkOperationRowResult, percentage: number, goodThreshold: number): void {
  if (!isBiddableEntity(row.entity) || row.orders === 0) return;

  const acosPercent = row.acos * 100;
  if (acosPercent < goodThreshold) {
    result.bid = row.bid * (1 + percentage / 100);
    result.modified = true;
  }
}

function applyCampaignRules(row: BulkOperationRow, result: BulkOperationRowResult, rules: CampaignRules): void {
  if (row.entity !== "Campaign") return;

  if (rules.newBudget) {
    result.dailyBudget = parseFloat(rules.newBudget);
    result.modified = true;
  }
  if (rules.pauseCampaign) {
    result.state = "paused";
    result.modified = true;
  }
}

export function roundBid(value: number): number {
  const factor = 10 ** BID_DECIMAL_PLACES;
  return Math.round(value * factor) / factor;
}

export function applyRulesToRow(row: BulkOperationRow, rules: CampaignRules): BulkOperationRowResult {
  const result: BulkOperationRowResult = { ...row, modified: false };

  if (row.entity === "Campaign") {
    applyCampaignRules(row, result, rules);
    return result;
  }

  if (rules.lowerBleeders) {
    applyBleeders(row, result);
  }

  if (rules.lowerAcosThreshold) {
    reduceBidForHighAcos(row, result, parseFloat(rules.lowerAcosThreshold));
  }

  if (rules.increaseLowClicks) {
    increaseBidForLowClicks(row, result, parseFloat(rules.increaseLowClicks));
  }

  if (rules.increaseGoodAcos && rules.goodAcosCriteria) {
    increaseBidForGoodAcos(row, result, parseFloat(rules.increaseGoodAcos), parseFloat(rules.goodAcosCriteria));
  }

  return result;
}
