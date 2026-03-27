import { describe, it, expect } from 'vitest';
import { createEmptyRules, buildRulesMap, clearDependentRules, hasIncompleteRules } from './rules';
import type { CampaignRules } from '../types';
import type { AggregatedCampaign } from '../types';

describe('createEmptyRules', () => {
  it('returns all fields with default empty values', () => {
    const rules = createEmptyRules();

    expect(rules.lowerBleeders).toBe(false);
    expect(rules.lowerAcosThreshold).toBe("");
    expect(rules.increaseLowClicks).toBe("");
    expect(rules.increaseGoodAcos).toBe("");
    expect(rules.goodAcosCriteria).toBe("");
    expect(rules.newBudget).toBe("");
    expect(rules.pauseCampaign).toBe(false);
    expect(rules.notes).toBe("");
  });
});

describe('buildRulesMap', () => {
  it('creates a map entry for each campaign', () => {
    const campaigns = [
      { campaignName: 'Camp A' },
      { campaignName: 'Camp B' },
    ] as AggregatedCampaign[];

    const map = buildRulesMap(campaigns);

    expect(map.size).toBe(2);
    expect(map.has('Camp A')).toBe(true);
    expect(map.has('Camp B')).toBe(true);
  });

  it('initializes each entry with empty rules', () => {
    const campaigns = [{ campaignName: 'Camp A' }] as AggregatedCampaign[];

    const map = buildRulesMap(campaigns);
    const rules = map.get('Camp A')!;

    expect(rules.lowerBleeders).toBe(false);
    expect(rules.notes).toBe("");
  });

  it('returns empty map for empty campaigns', () => {
    const map = buildRulesMap([]);
    expect(map.size).toBe(0);
  });
});

describe('clearDependentRules', () => {
  it('clears goodAcosCriteria when increaseGoodAcos is cleared', () => {
    const rules: CampaignRules = {
      ...createEmptyRules(),
      increaseGoodAcos: "",
      goodAcosCriteria: "30",
    };

    const result = clearDependentRules("increaseGoodAcos", rules);

    expect(result.goodAcosCriteria).toBe("");
  });

  it('does not clear goodAcosCriteria when increaseGoodAcos still has a value', () => {
    const rules: CampaignRules = {
      ...createEmptyRules(),
      increaseGoodAcos: "10",
      goodAcosCriteria: "30",
    };

    const result = clearDependentRules("increaseGoodAcos", rules);

    expect(result.goodAcosCriteria).toBe("30");
  });

  it('returns rules unchanged for unrelated fields', () => {
    const rules: CampaignRules = {
      ...createEmptyRules(),
      increaseGoodAcos: "10",
      goodAcosCriteria: "30",
      lowerAcosThreshold: "40",
    };

    const result = clearDependentRules("lowerAcosThreshold", rules);

    expect(result.goodAcosCriteria).toBe("30");
    expect(result.lowerAcosThreshold).toBe("40");
  });
});

describe('hasIncompleteRules', () => {
  it('returns true when increaseGoodAcos is set but goodAcosCriteria is empty', () => {
    const map = new Map([["Camp A", { ...createEmptyRules(), increaseGoodAcos: "10" }]]);
    expect(hasIncompleteRules(map)).toBe(true);
  });

  it('returns false when both increaseGoodAcos and goodAcosCriteria are set', () => {
    const map = new Map([["Camp A", { ...createEmptyRules(), increaseGoodAcos: "10", goodAcosCriteria: "30" }]]);
    expect(hasIncompleteRules(map)).toBe(false);
  });

  it('returns false when neither is set', () => {
    const map = new Map([["Camp A", createEmptyRules()]]);
    expect(hasIncompleteRules(map)).toBe(false);
  });

  it('returns true if any campaign has incomplete rules', () => {
    const map = new Map([
      ["Camp A", { ...createEmptyRules(), increaseGoodAcos: "10", goodAcosCriteria: "30" }],
      ["Camp B", { ...createEmptyRules(), increaseGoodAcos: "5" }],
    ]);
    expect(hasIncompleteRules(map)).toBe(true);
  });
});
