import type { AggregatedCampaign, CampaignRules } from '../types';

export function createEmptyRules(): CampaignRules {
  return {
    lowerBleeders: false,
    lowerAcosThreshold: "",
    increaseLowClicks: "",
    increaseGoodAcos: "",
    goodAcosCriteria: "",
    newBudget: "",
    pauseCampaign: false,
    notes: "",
  };
}

export function buildRulesMap(campaigns: AggregatedCampaign[]): Map<string, CampaignRules> {
  const map = new Map<string, CampaignRules>();
  for (const c of campaigns) {
    map.set(c.campaignName, createEmptyRules());
  }
  return map;
}
