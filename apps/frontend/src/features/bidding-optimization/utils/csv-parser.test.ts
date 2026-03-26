import { describe, it, expect } from 'vitest';
import { parseCSV } from './csv-parser';
import type { CSVRow } from '../types';

const HEADER = `Date,Portfolio name,Program Type,Campaign Name,Retailer,Country,Status,Currency,Budget Amount,Targeting Type,Bidding strategy,Impressions,Last Year Impressions,Clicks,Last Year Clicks,Click-Thru Rate (CTR),Spend,Last Year Spend,Cost Per Click (CPC),Last Year Cost Per Click (CPC),7 Day Total Orders (#),"Total Advertising Cost of Sales (ACOS) ",Total Return on Advertising Spend (ROAS),"7 Day Total Sales "`;

function csv(...rows: string[]): string {
  return [HEADER, ...rows].join('\n');
}

describe('parseCSV', () => {
  it('parses a basic row with all fields', () => {
    const input = csv(
      `"Feb 24, 2026",No Portfolio,Sponsored Products,My Campaign,Amazon,United States,ENABLED,USD,$100.0,Manual targeting,Dynamic bids - up and down,500,,10,,2.0%,$25.50,,$2.55,$0.0,3,6.5%,15.38,$392.0`
    );

    const rows = parseCSV(input);

    expect(rows).toHaveLength(1);
    expect(rows[0]).toEqual<CSVRow>({
      date: 'Feb 24, 2026',
      portfolioName: 'No Portfolio',
      campaignName: 'My Campaign',
      status: 'ENABLED',
      budgetAmount: 100.0,
      impressions: 500,
      clicks: 10,
      spend: 25.5,
      orders: 3,
      sales: 392.0,
    });
  });

  it('strips currency symbols from budget, spend, and sales', () => {
    const input = csv(
      `"Feb 24, 2026",Portfolio A,Sponsored Products,Camp A,Amazon,United States,PAUSED,USD,$35.0,Manual targeting,Dynamic bids - down only,41,,0,,0.0%,$0.0,,$0.0,$0.0,0,0.0%,0.0,$0.0`
    );

    const rows = parseCSV(input);

    expect(rows[0].budgetAmount).toBe(35.0);
    expect(rows[0].spend).toBe(0.0);
    expect(rows[0].sales).toBe(0.0);
  });

  it('handles empty/missing numeric values as 0', () => {
    const input = csv(
      `"Feb 24, 2026",No Portfolio,Sponsored Products,Camp B,Amazon,United States,PAUSED,USD,$20.0,Manual targeting,Dynamic bids - up and down,,,,,0.0%,,,,$0.0,,0.0%,0.0,`
    );

    const rows = parseCSV(input);

    expect(rows[0].impressions).toBe(0);
    expect(rows[0].clicks).toBe(0);
    expect(rows[0].spend).toBe(0);
    expect(rows[0].orders).toBe(0);
    expect(rows[0].sales).toBe(0);
  });

  it('handles commas in quoted campaign names', () => {
    const input = csv(
      `"Feb 24, 2026",No Portfolio,Sponsored Products,"Campaign, with commas",Amazon,United States,ENABLED,USD,$10.0,Automatic targeting,Dynamic bids - down only,100,,5,,5.0%,$5.0,,$1.0,$0.0,1,5.0%,20.0,$100.0`
    );

    const rows = parseCSV(input);

    expect(rows[0].campaignName).toBe('Campaign, with commas');
  });

  it('parses multiple rows', () => {
    const input = csv(
      `"Feb 24, 2026",No Portfolio,Sponsored Products,Camp A,Amazon,United States,ENABLED,USD,$50.0,Manual targeting,Dynamic bids - up and down,100,,5,,5.0%,$10.0,,$2.0,$0.0,1,5.0%,20.0,$200.0`,
      `"Feb 25, 2026",No Portfolio,Sponsored Products,Camp A,Amazon,United States,ENABLED,USD,$50.0,Manual targeting,Dynamic bids - up and down,200,,8,,4.0%,$15.0,,$1.875,$0.0,2,3.0%,33.33,$500.0`
    );

    const rows = parseCSV(input);

    expect(rows).toHaveLength(2);
    expect(rows[0].date).toBe('Feb 24, 2026');
    expect(rows[1].date).toBe('Feb 25, 2026');
  });

  it('handles BOM character at start of CSV', () => {
    const input = '\uFEFF' + csv(
      `"Feb 24, 2026",No Portfolio,Sponsored Products,Camp A,Amazon,United States,ENABLED,USD,$10.0,Manual targeting,Dynamic bids - down only,50,,2,,4.0%,$3.0,,$1.5,$0.0,0,0.0%,0.0,$0.0`
    );

    const rows = parseCSV(input);

    expect(rows).toHaveLength(1);
    expect(rows[0].date).toBe('Feb 24, 2026');
  });

  it('returns empty array for CSV with only headers', () => {
    const rows = parseCSV(HEADER);
    expect(rows).toEqual([]);
  });

  it('strips percentage symbols from ACOS (not used in output but ensures parser handles them)', () => {
    const input = csv(
      `"Feb 24, 2026",No Portfolio,Sponsored Products,Camp A,Amazon,United States,ENABLED,USD,$100.0,Manual targeting,Dynamic bids - up and down,1000,,50,,5.0%,$50.0,,$1.0,$0.0,5,10.0%,10.0,$500.0`
    );

    const rows = parseCSV(input);

    // Parser should extract numeric fields cleanly even when the CSV has % and $ symbols
    expect(rows[0].spend).toBe(50.0);
    expect(rows[0].sales).toBe(500.0);
    expect(rows[0].orders).toBe(5);
  });
});
