import "@supabase/functions-js/edge-runtime.d.ts";
import { json, corsPreflightResponse } from "../_shared/http.ts";
import { resolveDomainId } from "../_shared/keepa/keepa.util.ts";
import { fetchKeepaProducts } from "../_shared/keepa/keepa.api.ts";
import { resolveAmazonDomain } from "../_shared/rainforest/rainforest.util.ts";
import { fetchSerpAsins } from "../_shared/rainforest/rainforest.api.ts";

interface SerpCategory {
  id: number;
  name: string;
  path: string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return corsPreflightResponse();

  try {
    const { searchTerms, marketplace } = await req.json();

    if (!Array.isArray(searchTerms) || searchTerms.length === 0) {
      return json({ error: "searchTerms array is required" }, 400);
    }

    const amazonDomain = resolveAmazonDomain(marketplace);
    const domainId = resolveDomainId(marketplace);

    // Step 1: Fetch SERP ASINs for each search term (max 2) in parallel
    const terms = searchTerms.slice(0, 2);
    const asinBatches = await Promise.all(
      terms.map((term: string) => fetchSerpAsins(term, amazonDomain))
    );

    // Step 2: Collect unique ASINs across all terms
    const uniqueAsins = [...new Set(asinBatches.flat())];
    console.error(`[serp] ${uniqueAsins.length} unique ASINs from ${terms.length} search terms`);

    if (uniqueAsins.length === 0) {
      return json({ categories: [] });
    }

    // Step 3: Batch-fetch all products from Keepa (max 100 per call)
    const products = await fetchKeepaProducts(uniqueAsins.slice(0, 100), domainId);

    // Step 4: Extract unique leaf categories from each product's categoryTree
    const categoryMap = new Map<number, SerpCategory>();

    for (const product of products) {
      const tree = product.categoryTree;
      if (!tree || tree.length === 0) continue;

      const leaf = tree[tree.length - 1];
      if (categoryMap.has(leaf.catId)) continue;

      categoryMap.set(leaf.catId, {
        id: leaf.catId,
        name: leaf.name,
        path: tree.map((c) => c.name).join(" > "),
      });
    }

    const categories = [...categoryMap.values()];
    console.error(`[serp] ${categories.length} unique categories extracted`);

    return json({ categories });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return json({ error: message }, 500);
  }
});
