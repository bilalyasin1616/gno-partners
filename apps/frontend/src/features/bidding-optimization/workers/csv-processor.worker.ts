import { parseCSV } from '../utils/csv-parser';
import { aggregateCampaigns } from '../utils/aggregation';

self.onmessage = (event: MessageEvent<string>) => {
  try {
    const rows = parseCSV(event.data);
    const campaigns = aggregateCampaigns(rows);
    self.postMessage({ success: true, data: campaigns });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to process CSV';
    self.postMessage({ success: false, error: message });
  }
};
