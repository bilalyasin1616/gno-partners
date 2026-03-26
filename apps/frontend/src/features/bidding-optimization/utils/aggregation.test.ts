import { describe, it, expect } from 'vitest';
import { aggregateCampaigns } from './aggregation';
import type { CSVRow } from '../types';

function row(overrides: Partial<CSVRow> = {}): CSVRow {
  return {
    date: 'Mar 01, 2026',
    portfolioName: 'No Portfolio',
    campaignName: 'Camp A',
    status: 'ENABLED',
    budgetAmount: 100,
    impressions: 0,
    clicks: 0,
    spend: 0,
    orders: 0,
    sales: 0,
    ...overrides,
  };
}

/** Generate 30 days of dates: Feb 24 .. Mar 25, 2026 */
function dates(count: number): string[] {
  const result: string[] = [];
  const start = new Date(2026, 1, 24); // Feb 24
  for (let i = 0; i < count; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const month = d.toLocaleString('en-US', { month: 'short' });
    const day = String(d.getDate()).padStart(2, '0');
    result.push(`${month} ${day}, 2026`);
  }
  return result;
}

describe('aggregateCampaigns', () => {
  it('sums 30d metrics across all rows for a campaign', () => {
    const allDates = dates(30);
    const rows = allDates.map((date) =>
      row({ date, impressions: 10, clicks: 2, spend: 5, orders: 1, sales: 50 })
    );

    const result = aggregateCampaigns(rows);

    expect(result).toHaveLength(1);
    expect(result[0].impressions30d).toBe(300);
    expect(result[0].clicks30d).toBe(60);
    expect(result[0].spend30d).toBe(150);
    expect(result[0].orders30d).toBe(30);
    expect(result[0].sales30d).toBe(1500);
  });

  it('sums only last 7 dates for 7d metrics', () => {
    const allDates = dates(30);
    const rows = allDates.map((date, i) =>
      row({
        date,
        impressions: i < 23 ? 1 : 10, // first 23 days = 1, last 7 days = 10
        clicks: i < 23 ? 0 : 5,
        spend: i < 23 ? 0 : 20,
        orders: i < 23 ? 0 : 3,
        sales: i < 23 ? 0 : 100,
      })
    );

    const result = aggregateCampaigns(rows);

    expect(result[0].impressions7d).toBe(70);
    expect(result[0].clicks7d).toBe(35);
    expect(result[0].spend7d).toBe(140);
    expect(result[0].orders7d).toBe(21);
    expect(result[0].sales7d).toBe(700);
  });

  it('calculates ACOS as (spend / sales) * 100', () => {
    const allDates = dates(30);
    const rows = allDates.map((date) =>
      row({ date, spend: 10, sales: 200 })
    );

    const result = aggregateCampaigns(rows);

    // 30d: spend=300, sales=6000 → ACOS = 5%
    expect(result[0].acos30d).toBeCloseTo(5);
    // 7d: spend=70, sales=1400 → ACOS = 5%
    expect(result[0].acos7d).toBeCloseTo(5);
  });

  it('returns 0 ACOS when sales are 0', () => {
    const allDates = dates(30);
    const rows = allDates.map((date) =>
      row({ date, spend: 10, sales: 0 })
    );

    const result = aggregateCampaigns(rows);

    expect(result[0].acos30d).toBe(0);
    expect(result[0].acos7d).toBe(0);
  });

  it('calculates ACOS delta as percentage change', () => {
    const allDates = dates(30);
    // First 23 days: ACOS = spend 10 / sales 100 = 10%
    // Last 7 days: ACOS = spend 5 / sales 100 = 5%
    const rows = allDates.map((date, i) =>
      row({
        date,
        spend: i < 23 ? 10 : 5,
        sales: 100,
      })
    );

    const result = aggregateCampaigns(rows);

    // 30d ACOS: (23*10 + 7*5) / (30*100) * 100 = 265/3000*100 = 8.833%
    // 7d ACOS: 35/700*100 = 5%
    // Delta: ((5 - 8.833) / 8.833) * 100 = -43.4%
    const expected30dAcos = (265 / 3000) * 100;
    const expected7dAcos = 5;
    const expectedDelta = ((expected7dAcos - expected30dAcos) / expected30dAcos) * 100;

    expect(result[0].acosDelta).toBeCloseTo(expectedDelta);
  });

  it('returns 0 ACOS delta when 30d ACOS is 0', () => {
    const allDates = dates(30);
    const rows = allDates.map((date) =>
      row({ date, spend: 0, sales: 0 })
    );

    const result = aggregateCampaigns(rows);

    expect(result[0].acosDelta).toBe(0);
  });

  it('returns 0 ACOS delta when 7d ACOS is 0', () => {
    const allDates = dates(30);
    const rows = allDates.map((date, i) =>
      row({ date, spend: i < 23 ? 10 : 0, sales: 100 })
    );

    const result = aggregateCampaigns(rows);

    expect(result[0].acosDelta).toBe(0);
  });

  it('extracts yesterday and day-before-yesterday spend', () => {
    const allDates = dates(30);
    const rows = allDates.map((date, i) =>
      row({ date, spend: i === 29 ? 80 : i === 28 ? 45 : 10 })
    );

    const result = aggregateCampaigns(rows);

    expect(result[0].spentYesterday).toBe(80);
    expect(result[0].spentDayBeforeYesterday).toBe(45);
  });

  it('sets budget check when yesterday spend >= 90% of budget', () => {
    const allDates = dates(30);
    const rows = allDates.map((date, i) =>
      row({ date, budgetAmount: 100, spend: i === 29 ? 90 : 5 })
    );

    const result = aggregateCampaigns(rows);

    expect(result[0].budgetCheck).toBe(true);
  });

  it('does not set budget check when yesterday spend < 90% of budget', () => {
    const allDates = dates(30);
    const rows = allDates.map((date, i) =>
      row({ date, budgetAmount: 100, spend: i === 29 ? 50 : 5 })
    );

    const result = aggregateCampaigns(rows);

    expect(result[0].budgetCheck).toBe(false);
  });

  it('groups multiple campaigns separately', () => {
    const allDates = dates(30);
    const rows = allDates.flatMap((date) => [
      row({ date, campaignName: 'Camp A', impressions: 10 }),
      row({ date, campaignName: 'Camp B', impressions: 20 }),
    ]);

    const result = aggregateCampaigns(rows);

    expect(result).toHaveLength(2);
    const campA = result.find((c) => c.campaignName === 'Camp A');
    const campB = result.find((c) => c.campaignName === 'Camp B');
    expect(campA?.impressions30d).toBe(300);
    expect(campB?.impressions30d).toBe(600);
  });

  it('handles campaign with only 1 day of data', () => {
    const rows = [row({ date: 'Mar 25, 2026', spend: 42, budgetAmount: 50 })];

    const result = aggregateCampaigns(rows);

    expect(result[0].spend30d).toBe(42);
    expect(result[0].spend7d).toBe(42);
    expect(result[0].spentYesterday).toBe(42);
    expect(result[0].spentDayBeforeYesterday).toBe(0);
  });

  it('carries over campaign metadata (status, portfolio, budget)', () => {
    const rows = [
      row({
        date: 'Mar 25, 2026',
        campaignName: 'My Camp',
        status: 'PAUSED',
        portfolioName: 'My Portfolio',
        budgetAmount: 75,
      }),
    ];

    const result = aggregateCampaigns(rows);

    expect(result[0].status).toBe('PAUSED');
    expect(result[0].portfolio).toBe('My Portfolio');
    expect(result[0].budget).toBe(75);
  });
});
