import type { RuleConfig } from '../types';

export function createDefaultRuleConfig(): RuleConfig {
  return {
    bleederLowClicks: 6,
    bleederMidClicks: 8,
    bleederPauseClicks: 15,
    bleederLowReduction: 5,
    bleederMidReduction: 10,
    lowClicksThreshold: 1,
  };
}
