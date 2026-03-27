import type { CSVRow, AggregatedCampaign } from '../types';

function computeAcos(spend: number, sales: number): number {
  return sales === 0 ? 0 : (spend / sales) * 100;
}

function computeAcosDelta(acos30d: number, acos7d: number): number {
  if (acos30d === 0 || acos7d === 0) return 0;
  return ((acos7d - acos30d) / acos30d) * 100;
}

function sortedUniqueDates(rows: CSVRow[]): string[] {
  const unique = [...new Set(rows.map((r) => r.date))];
  return unique.sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );
}

function sumField(rows: CSVRow[], field: keyof CSVRow): number {
  return rows.reduce((sum, r) => sum + (r[field] as number), 0);
}

function aggregate(rows: CSVRow[], allDates: string[]): AggregatedCampaign {
  const last7Dates = new Set(allDates.slice(-7));
  const yesterday = allDates.at(-1);
  const dayBeforeYesterday = allDates.at(-2);

  const rows7d = rows.filter((r) => last7Dates.has(r.date));
  const yesterdayRow = rows.find((r) => r.date === yesterday);
  const dbyRow = rows.find((r) => r.date === dayBeforeYesterday);

  const first = rows[0];
  const spend30d = sumField(rows, 'spend');
  const sales30d = sumField(rows, 'sales');
  const spend7d = sumField(rows7d, 'spend');
  const sales7d = sumField(rows7d, 'sales');
  const acos30d = computeAcos(spend30d, sales30d);
  const acos7d = computeAcos(spend7d, sales7d);
  const spentYesterday = yesterdayRow?.spend ?? 0;

  return {
    campaignName: first.campaignName,
    status: first.status,
    portfolio: first.portfolioName,
    budget: first.budgetAmount,

    impressions30d: sumField(rows, 'impressions'),
    impressions7d: sumField(rows7d, 'impressions'),
    clicks30d: sumField(rows, 'clicks'),
    clicks7d: sumField(rows7d, 'clicks'),
    spend30d,
    spend7d,
    orders30d: sumField(rows, 'orders'),
    orders7d: sumField(rows7d, 'orders'),
    sales30d,
    sales7d,
    acos30d,
    acos7d,

    acosDelta: computeAcosDelta(acos30d, acos7d),

    spentYesterday,
    spentDayBeforeYesterday: dbyRow?.spend ?? 0,

    budgetCheck: first.budgetAmount > 0 && spentYesterday >= first.budgetAmount * 0.9,
  };
}

export function aggregateCampaigns(rows: CSVRow[]): AggregatedCampaign[] {
  const allDates = sortedUniqueDates(rows);

  const grouped = new Map<string, CSVRow[]>();
  for (const row of rows) {
    const existing = grouped.get(row.campaignName);
    if (existing) {
      existing.push(row);
    } else {
      grouped.set(row.campaignName, [row]);
    }
  }

  const campaigns = Array.from(grouped.values())
    .map((campaignRows) => aggregate(campaignRows, allDates))
    .filter((campaign) => campaign.status !== "PAUSED");

  return campaigns;
}
