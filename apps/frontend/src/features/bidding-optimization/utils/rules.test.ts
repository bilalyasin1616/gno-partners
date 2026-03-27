import { describe, it, expect } from 'vitest';
import { createEmptyRules, buildRulesMap } from './rules';
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
