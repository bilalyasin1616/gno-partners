import Papa from 'papaparse';
import type { CSVRow } from '../types';

function parseNumber(value: string | undefined): number {
  if (!value || value.trim() === '') return 0;
  const cleaned = value.replace(/[$,%]/g, '').trim();
  const num = Number(cleaned);
  return Number.isNaN(num) ? 0 : num;
}

export function parseCSV(csvText: string): CSVRow[] {
  const text = csvText.replace(/^\uFEFF/, '');

  const { data } = Papa.parse<Record<string, string>>(text, {
    header: true,
    skipEmptyLines: true,
  });

  return data.map((row) => ({
    date: row['Date'] ?? '',
    portfolioName: row['Portfolio name'] ?? '',
    campaignName: row['Campaign Name'] ?? '',
    status: row['Status'] ?? '',
    budgetAmount: parseNumber(row['Budget Amount']),
    impressions: parseNumber(row['Impressions']),
    clicks: parseNumber(row['Clicks']),
    spend: parseNumber(row['Spend']),
    orders: parseNumber(row['7 Day Total Orders (#)']),
    sales: parseNumber(row['7 Day Total Sales ']),
  }));
}
