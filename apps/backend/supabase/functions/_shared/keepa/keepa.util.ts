export const KEEPA_API_BASE = "https://api.keepa.com";

export const MARKETPLACE_DOMAINS: Record<string, number> = {
  US: 1,
  UK: 2,
  DE: 3,
  FR: 4,
  JP: 5,
  CA: 6,
  IT: 8,
  ES: 9,
  IN: 10,
  MX: 11,
  AU: 13,
};

export function requireKeepaKey(): string {
  const key = Deno.env.get("KEEPA_API_KEY");
  if (!key) throw new Error("KEEPA_API_KEY not configured");
  return key;
}

export function resolveDomainId(marketplace: string | undefined): number {
  const domainId = MARKETPLACE_DOMAINS[marketplace?.toUpperCase() ?? "US"];
  if (!domainId) {
    throw new Error(
      `Invalid marketplace. Supported: ${Object.keys(MARKETPLACE_DOMAINS).join(", ")}`
    );
  }
  return domainId;
}

export async function throwKeepaError(res: Response, context: string): Promise<never> {
  if (res.status === 429) {
    throw new Error("Keepa rate limit exceeded, please wait or upgrade plan");
  }
  const text = await res.text();
  throw new Error(`Keepa ${context} error (${res.status}): ${text}`);
}

/** Extract the most recent BSR from Keepa's salesRanks array for a given root category. */
export function extractBsr(
  salesRanks: Record<string, number[]> | undefined,
  rootCategory: number | undefined
): number | null {
  if (!salesRanks || !rootCategory) return null;
  const ranks = salesRanks[String(rootCategory)];
  if (!ranks || ranks.length < 2) return null;
  // Keepa stores ranks as [timestamp, rank, timestamp, rank, ...]
  return ranks[ranks.length - 1];
}

/** Extract the first image URL from Keepa's imagesCSV field. */
export function extractImageUrl(imagesCSV: string | undefined): string | null {
  if (!imagesCSV) return null;
  const firstImage = imagesCSV.split(",")[0];
  if (!firstImage) return null;
  return `https://images-na.ssl-images-amazon.com/images/I/${firstImage}`;
}
