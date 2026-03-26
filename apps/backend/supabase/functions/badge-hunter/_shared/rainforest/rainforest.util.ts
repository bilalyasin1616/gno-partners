export const RAINFOREST_API_BASE = "https://api.rainforestapi.com/request";

export const MARKETPLACE_AMAZON_DOMAINS: Record<string, string> = {
  US: "amazon.com",
  UK: "amazon.co.uk",
  DE: "amazon.de",
  FR: "amazon.fr",
  JP: "amazon.co.jp",
  CA: "amazon.ca",
  IT: "amazon.it",
  ES: "amazon.es",
  IN: "amazon.in",
  MX: "amazon.com.mx",
  AU: "amazon.com.au",
};

export function requireRainforestKey(): string {
  const key = Deno.env.get("RAINFOREST_API_KEY");
  if (!key) throw new Error("RAINFOREST_API_KEY not configured");
  return key;
}

export function resolveAmazonDomain(marketplace: string | undefined): string {
  const domain =
    MARKETPLACE_AMAZON_DOMAINS[marketplace?.toUpperCase() ?? "US"];
  if (!domain) {
    throw new Error(
      `Invalid marketplace. Supported: ${Object.keys(MARKETPLACE_AMAZON_DOMAINS).join(", ")}`
    );
  }
  return domain;
}
