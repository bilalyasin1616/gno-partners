import type { CampaignRules, RuleConfig } from '../types';
import { applyRulesToBulkSheet } from '../utils/xlsx-processor';

interface WorkerMessage {
  xlsxBuffer: ArrayBuffer;
  rulesMap: [string, CampaignRules][];
  ruleConfig: RuleConfig;
}

self.onmessage = (event: MessageEvent<WorkerMessage>) => {
  try {
    const { xlsxBuffer, rulesMap: entries, ruleConfig } = event.data;
    const rulesMap = new Map<string, CampaignRules>(entries);
    const { blob, modifiedCount } = applyRulesToBulkSheet(xlsxBuffer, rulesMap, ruleConfig);
    self.postMessage({ success: true, blob, modifiedCount });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to process bulk sheet';
    self.postMessage({ success: false, error: message });
  }
};
