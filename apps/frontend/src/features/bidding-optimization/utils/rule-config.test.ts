import { describe, it, expect } from 'vitest';
import { createDefaultRuleConfig } from './rule-config';

describe('createDefaultRuleConfig', () => {
  it('returns correct default values', () => {
    const config = createDefaultRuleConfig();

    expect(config.bleederLowClicks).toBe(6);
    expect(config.bleederMidClicks).toBe(8);
    expect(config.bleederPauseClicks).toBe(15);
    expect(config.bleederLowReduction).toBe(5);
    expect(config.bleederMidReduction).toBe(10);
    expect(config.lowClicksThreshold).toBe(1);
  });
});
