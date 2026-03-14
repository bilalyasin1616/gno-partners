import type { SalesEstimateResult, RainforestSalesResponse, RainforestSearchResponse } from "./rainforest.type.ts";
import { RAINFOREST_API_BASE, requireRainforestKey } from "./rainforest.util.ts";

/** Fetch monthly sales estimate for a single ASIN. Returns null on failure. */
export async function fetchSalesEstimate(
  asin: string,
  amazonDomain: string
): Promise<SalesEstimateResult | null> {
  const apiKey = requireRainforestKey();
  const url = new URL(RAINFOREST_API_BASE);
  url.searchParams.set("api_key", apiKey);
  url.searchParams.set("type", "sales_estimation");
  url.searchParams.set("asin", asin);
  url.searchParams.set("amazon_domain", amazonDomain);

  const res = await fetch(url.toString());
  if (!res.ok) {
    const text = await res.text();
    console.error(`[sales] ${asin}: API error (${res.status}): ${text}`);
    return null;
  }

  const data: RainforestSalesResponse = await res.json();
  const monthlySales = data.sales_estimation?.monthly_sales_estimate ?? null;

  if (monthlySales === null || monthlySales === undefined) {
    console.error(`[sales] ${asin}: could not extract monthly sales from response`);
    return null;
  }

  console.error(`[sales] ${asin}: ${monthlySales} monthly sales`);
  return { monthlySales: Number(monthlySales) };
}

/** Fetch ASINs from a Rainforest SERP search (first 40 results). Returns [] on failure. */
export async function fetchSerpAsins(
  searchTerm: string,
  amazonDomain: string
): Promise<string[]> {
  const apiKey = requireRainforestKey();
  const url = new URL(RAINFOREST_API_BASE);
  url.searchParams.set("api_key", apiKey);
  url.searchParams.set("type", "search");
  url.searchParams.set("search_term", searchTerm);
  url.searchParams.set("amazon_domain", amazonDomain);

  const res = await fetch(url.toString());
  if (!res.ok) {
    const text = await res.text();
    console.error(`[serp] "${searchTerm}": API error (${res.status}): ${text}`);
    return [];
  }

  const data: RainforestSearchResponse = await res.json();
  const results = data.search_results ?? [];

  // Take first 40 products per search term
  return results.slice(0, 40).map((r) => r.asin).filter(Boolean);
}
