import { describe, it, expect } from 'vitest';
import { applyRulesToRow } from './rule-engine';
import { createDefaultRuleConfig } from './rule-config';
import type { CampaignRules, BulkOperationRow } from '../types';

const defaultConfig = createDefaultRuleConfig();

function emptyRules(overrides: Partial<CampaignRules> = {}): CampaignRules {
  return {
    lowerBleeders: false,
    lowerAcosThreshold: "",
    increaseLowClicks: "",
    increaseGoodAcos: "",
    goodAcosCriteria: "",
    newBudget: "",
    pauseCampaign: false,
    notes: "",
    ...overrides,
  };
}

function targetRow(overrides: Partial<BulkOperationRow> = {}): BulkOperationRow {
  return {
    entity: "Keyword",
    bid: 1.00,
    clicks: 0,
    orders: 0,
    acos: 0,
    state: "enabled",
    ...overrides,
  };
}

describe('applyRulesToRow — Lower Bleeders', () => {
  const rules = emptyRules({ lowerBleeders: true });

  it('does nothing when clicks < 6', () => {
    const row = targetRow({ clicks: 5, orders: 0, bid: 1.00 });
    const result = applyRulesToRow(row, rules, defaultConfig);
    expect(result.bid).toBe(1.00);
    expect(result.modified).toBe(false);
  });

  it('reduces bid by 5% for 6-7 clicks with 0 orders', () => {
    const row = targetRow({ clicks: 6, orders: 0, bid: 1.00 });
    const result = applyRulesToRow(row, rules, defaultConfig);
    expect(result.bid).toBeCloseTo(0.95);
    expect(result.modified).toBe(true);
  });

  it('reduces bid by 5% for 7 clicks with 0 orders', () => {
    const row = targetRow({ clicks: 7, orders: 0, bid: 2.00 });
    const result = applyRulesToRow(row, rules, defaultConfig);
    expect(result.bid).toBeCloseTo(1.90);
    expect(result.modified).toBe(true);
  });

  it('reduces bid by 10% for 8-14 clicks with 0 orders', () => {
    const row = targetRow({ clicks: 10, orders: 0, bid: 1.00 });
    const result = applyRulesToRow(row, rules, defaultConfig);
    expect(result.bid).toBeCloseTo(0.90);
    expect(result.modified).toBe(true);
  });

  it('pauses target for 15+ clicks with 0 orders', () => {
    const row = targetRow({ clicks: 15, orders: 0, bid: 1.00 });
    const result = applyRulesToRow(row, rules, defaultConfig);
    expect(result.state).toBe("paused");
    expect(result.modified).toBe(true);
  });

  it('does not affect targets with orders > 0', () => {
    const row = targetRow({ clicks: 20, orders: 1, bid: 1.00 });
    const result = applyRulesToRow(row, rules, defaultConfig);
    expect(result.bid).toBe(1.00);
    expect(result.state).toBe("enabled");
  });
});

describe('applyRulesToRow — Lower ACOS >', () => {
  it('reduces bid by ACOS delta percentage', () => {
    const rules = emptyRules({ lowerAcosThreshold: "40" });
    const row = targetRow({ orders: 1, acos: 0.58, bid: 1.00 }); // 58% ACOS
    const result = applyRulesToRow(row, rules, defaultConfig);
    // delta = 58 - 40 = 18, bid × (1 - 18/100) = 0.82
    expect(result.bid).toBeCloseTo(0.82);
    expect(result.modified).toBe(true);
  });

  it('does not affect targets below threshold', () => {
    const rules = emptyRules({ lowerAcosThreshold: "40" });
    const row = targetRow({ orders: 1, acos: 0.35, bid: 1.00 }); // 35% < 40%
    const result = applyRulesToRow(row, rules, defaultConfig);
    expect(result.bid).toBe(1.00);
    expect(result.modified).toBe(false);
  });

  it('does not affect targets with 0 orders', () => {
    const rules = emptyRules({ lowerAcosThreshold: "40" });
    const row = targetRow({ orders: 0, acos: 0.60, bid: 1.00 });
    const result = applyRulesToRow(row, rules, defaultConfig);
    expect(result.bid).toBe(1.00);
  });
});

describe('applyRulesToRow — Inc Low Clicks', () => {
  it('increases bid by percentage for targets with 0 clicks', () => {
    const rules = emptyRules({ increaseLowClicks: "10" });
    const row = targetRow({ clicks: 0, bid: 1.00 });
    const result = applyRulesToRow(row, rules, defaultConfig);
    expect(result.bid).toBeCloseTo(1.10);
    expect(result.modified).toBe(true);
  });

  it('increases bid for targets with 1 click', () => {
    const rules = emptyRules({ increaseLowClicks: "5" });
    const row = targetRow({ clicks: 1, bid: 2.00 });
    const result = applyRulesToRow(row, rules, defaultConfig);
    expect(result.bid).toBeCloseTo(2.10);
    expect(result.modified).toBe(true);
  });

  it('does not affect targets with > 1 click', () => {
    const rules = emptyRules({ increaseLowClicks: "10" });
    const row = targetRow({ clicks: 2, bid: 1.00 });
    const result = applyRulesToRow(row, rules, defaultConfig);
    expect(result.bid).toBe(1.00);
    expect(result.modified).toBe(false);
  });
});

describe('applyRulesToRow — Inc Good ACOS', () => {
  it('increases bid for targets with ACOS below threshold', () => {
    const rules = emptyRules({ increaseGoodAcos: "10", goodAcosCriteria: "24" });
    const row = targetRow({ orders: 1, acos: 0.20, bid: 1.00 }); // 20% < 24%
    const result = applyRulesToRow(row, rules, defaultConfig);
    expect(result.bid).toBeCloseTo(1.10);
    expect(result.modified).toBe(true);
  });

  it('does not affect targets with ACOS above threshold', () => {
    const rules = emptyRules({ increaseGoodAcos: "10", goodAcosCriteria: "24" });
    const row = targetRow({ orders: 1, acos: 0.30, bid: 1.00 }); // 30% > 24%
    const result = applyRulesToRow(row, rules, defaultConfig);
    expect(result.bid).toBe(1.00);
    expect(result.modified).toBe(false);
  });

  it('does not affect targets with 0 orders', () => {
    const rules = emptyRules({ increaseGoodAcos: "10", goodAcosCriteria: "24" });
    const row = targetRow({ orders: 0, acos: 0, bid: 1.00 });
    const result = applyRulesToRow(row, rules, defaultConfig);
    expect(result.bid).toBe(1.00);
  });

  it('requires both percentage and criteria to be set', () => {
    const rules = emptyRules({ increaseGoodAcos: "10", goodAcosCriteria: "" });
    const row = targetRow({ orders: 1, acos: 0.10, bid: 1.00 });
    const result = applyRulesToRow(row, rules, defaultConfig);
    expect(result.bid).toBe(1.00);
    expect(result.modified).toBe(false);
  });
});

describe('applyRulesToRow — Campaign-level rules', () => {
  it('changes budget for Campaign entity', () => {
    const rules = emptyRules({ newBudget: "25" });
    const row = { entity: "Campaign", bid: 0, clicks: 0, orders: 0, acos: 0, state: "enabled", dailyBudget: 100 };
    const result = applyRulesToRow(row as never, rules, defaultConfig);
    expect(result.dailyBudget).toBe(25);
    expect(result.modified).toBe(true);
  });

  it('pauses campaign', () => {
    const rules = emptyRules({ pauseCampaign: true });
    const row = { entity: "Campaign", bid: 0, clicks: 0, orders: 0, acos: 0, state: "enabled", dailyBudget: 100 };
    const result = applyRulesToRow(row as never, rules, defaultConfig);
    expect(result.state).toBe("paused");
    expect(result.modified).toBe(true);
  });
});

describe('applyRulesToRow — multiple rules combined', () => {
  it('applies bleeders and low clicks rules to different targets', () => {
    const rules = emptyRules({ lowerBleeders: true, increaseLowClicks: "10" });

    const bleeder = targetRow({ clicks: 10, orders: 0, bid: 1.00 });
    const lowClick = targetRow({ clicks: 0, orders: 0, bid: 1.00 });

    expect(applyRulesToRow(bleeder, rules, defaultConfig).bid).toBeCloseTo(0.90);
    expect(applyRulesToRow(lowClick, rules, defaultConfig).bid).toBeCloseTo(1.10);
  });
});
