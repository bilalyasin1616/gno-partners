import type { CampaignRules, BulkOperationRow, BulkOperationRowResult, RuleConfig } from '../types';

const BID_DECIMAL_PLACES = 2;

function isBiddableEntity(entity: string): boolean {
  return entity === "Keyword" || entity === "Product Targeting";
}

function applyBleeders(row: BulkOperationRow, result: BulkOperationRowResult, config: RuleConfig): void {
  if (!isBiddableEntity(row.entity) || row.orders > 0) return;

  if (row.clicks >= config.bleederPauseClicks) {
    result.state = "paused";
    result.modified = true;
  } else if (row.clicks >= config.bleederMidClicks) {
    result.bid = row.bid * (1 - config.bleederMidReduction / 100);
    result.modified = true;
  } else if (row.clicks >= config.bleederLowClicks) {
    result.bid = row.bid * (1 - config.bleederLowReduction / 100);
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

function increaseBidForLowClicks(row: BulkOperationRow, result: BulkOperationRowResult, percentage: number, config: RuleConfig): void {
  if (!isBiddableEntity(row.entity) || row.clicks > config.lowClicksThreshold) return;

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

export function applyRulesToRow(row: BulkOperationRow, rules: CampaignRules, config: RuleConfig): BulkOperationRowResult {
  const result: BulkOperationRowResult = { ...row, modified: false };

  if (row.entity === "Campaign") {
    applyCampaignRules(row, result, rules);
    return result;
  }

  if (rules.lowerBleeders) {
    applyBleeders(row, result, config);
  }

  if (rules.lowerAcosThreshold) {
    reduceBidForHighAcos(row, result, parseFloat(rules.lowerAcosThreshold));
  }

  if (rules.increaseLowClicks) {
    increaseBidForLowClicks(row, result, parseFloat(rules.increaseLowClicks), config);
  }

  if (rules.increaseGoodAcos && rules.goodAcosCriteria) {
    increaseBidForGoodAcos(row, result, parseFloat(rules.increaseGoodAcos), parseFloat(rules.goodAcosCriteria));
  }

  return result;
}
