import type { AggregatedCampaign, CampaignRules } from '../types';

export function hasAnyRulesSet(rulesMap: Map<string, CampaignRules>): boolean {
  for (const rules of rulesMap.values()) {
    if (
      rules.lowerBleeders ||
      rules.lowerAcosThreshold ||
      rules.increaseLowClicks ||
      rules.increaseGoodAcos ||
      rules.goodAcosCriteria ||
      rules.newBudget ||
      rules.pauseCampaign
    ) return true;
  }
  return false;
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

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

export function hasIncompleteRules(rulesMap: Map<string, CampaignRules>): boolean {
  for (const rules of rulesMap.values()) {
    if (rules.increaseGoodAcos && !rules.goodAcosCriteria) return true;
  }
  return false;
}

export function clearDependentRules(changedField: keyof CampaignRules, rules: CampaignRules): CampaignRules {
  if (changedField === "increaseGoodAcos" && !rules.increaseGoodAcos) {
    return { ...rules, goodAcosCriteria: "" };
  }
  return rules;
}

export function buildRulesMap(campaigns: AggregatedCampaign[]): Map<string, CampaignRules> {
  const map = new Map<string, CampaignRules>();
  for (const c of campaigns) {
    map.set(c.campaignName, createEmptyRules());
  }
  return map;
}
