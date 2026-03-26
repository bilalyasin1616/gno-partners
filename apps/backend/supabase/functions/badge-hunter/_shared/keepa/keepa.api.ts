import type {
  KeepaProduct,
  KeepaProductResponse,
  KeepaCategory,
  KeepaCategoryResponse,
  KeepaSearchCategory,
  KeepaSearchResponse,
  KeepaBestSellerResponse,
} from "./keepa.type.ts";
import { KEEPA_API_BASE, requireKeepaKey, throwKeepaError } from "./keepa.util.ts";

/** Fetch product details for one or more ASINs. */
export async function fetchKeepaProducts(
  asins: string[],
  domainId: number
): Promise<KeepaProduct[]> {
  const apiKey = requireKeepaKey();
  const url = new URL(`${KEEPA_API_BASE}/product`);
  url.searchParams.set("key", apiKey);
  url.searchParams.set("domain", String(domainId));
  url.searchParams.set("asin", asins.join(","));
  url.searchParams.set("days", "1");

  const res = await fetch(url.toString());
  if (!res.ok) await throwKeepaError(res, "product API");

  const data: KeepaProductResponse = await res.json();
  return data.products ?? [];
}

/** Fetch category details by IDs (batched in groups of 10). */
export async function fetchKeepaCategories(
  ids: number[],
  domainId: number
): Promise<Record<number, KeepaCategory>> {
  const apiKey = requireKeepaKey();
  const BATCH_SIZE = 10;
  const result: Record<number, KeepaCategory> = {};
  const validIds = ids.filter((id) => id && id > 0);

  for (let i = 0; i < validIds.length; i += BATCH_SIZE) {
    const batch = validIds.slice(i, i + BATCH_SIZE);
    // Build URL manually to avoid URLSearchParams encoding commas as %2C
    const url =
      `${KEEPA_API_BASE}/category?key=${apiKey}&domain=${domainId}&category=${batch.join(",")}&parents=0`;

    const res = await fetch(url);
    if (!res.ok) await throwKeepaError(res, "category API");

    const data: KeepaCategoryResponse = await res.json();
    for (const [idStr, cat] of Object.entries(data.categories ?? {})) {
      result[Number(idStr)] = cat;
    }
  }

  return result;
}

/** Search Keepa categories by term. Returns the raw category map. */
export async function searchKeepaCategories(
  term: string,
  domainId: number
): Promise<Record<string, KeepaSearchCategory>> {
  const apiKey = requireKeepaKey();
  const encodedTerm = encodeURIComponent(term);
  const url = `${KEEPA_API_BASE}/search?key=${apiKey}&domain=${domainId}&type=category&term=${encodedTerm}`;

  const res = await fetch(url);
  if (!res.ok) await throwKeepaError(res, "search API");

  const data: KeepaSearchResponse = await res.json();
  return data.categories ?? {};
}

/** Fetch the top bestseller ASIN for a category. Returns null if none found. */
export async function fetchKeepaBestSeller(
  catId: number,
  domainId: number
): Promise<string | null> {
  const apiKey = requireKeepaKey();
  const url = `${KEEPA_API_BASE}/bestsellers?key=${apiKey}&domain=${domainId}&category=${catId}&sublist=1`;
  const res = await fetch(url);
  if (!res.ok) await throwKeepaError(res, "bestseller API");
  const data: KeepaBestSellerResponse = await res.json();
  return data.bestSellersList?.asinList?.[0] ?? null;
}
