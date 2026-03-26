import type { CategoryInput, CategoryResult } from "./types.ts";
import type { KeepaProduct } from "../_shared/keepa/keepa.type.ts";
import { extractBsr } from "../_shared/keepa/keepa.util.ts";
import { fetchKeepaBestSeller, fetchKeepaProducts } from "../_shared/keepa/keepa.api.ts";

export async function compareCategoriesWithBestSellers(
  categories: CategoryInput[],
  domainId: number
): Promise<CategoryResult[]> {
  // Step 1: fetch best seller ASIN per category in parallel
  // Use allSettled so one failure doesn't abort all results
  const settledResults = await Promise.allSettled(
    categories.map((cat) => fetchKeepaBestSeller(cat.id, domainId))
  );

  // Log each bestseller fetch result for debugging
  categories.forEach((cat, i) => {
    const r = settledResults[i];
    if (r.status === "rejected") {
      console.error(`[bestseller] cat ${cat.id} (${cat.name}): FAILED — ${r.reason}`);
    } else {
      console.error(`[bestseller] cat ${cat.id} (${cat.name}): ${r.value ?? "null (no data)"}`);
    }
  });

  // Map catIndex → asin (null for failed/empty)
  const asinByCatIndex: (string | null)[] = settledResults.map((r) =>
    r.status === "fulfilled" ? r.value : null
  );

  // Step 2: collect unique non-null ASINs for a single batch product fetch
  const uniqueAsins = [
    ...new Set(asinByCatIndex.filter((a): a is string => a !== null)),
  ];

  console.error(`[products] fetching ${uniqueAsins.length} unique ASINs: ${uniqueAsins.join(", ")}`);

  // Step 3: batch-fetch product details for all best sellers
  const productMap = new Map<string, KeepaProduct>();
  if (uniqueAsins.length > 0) {
    const products = await fetchKeepaProducts(uniqueAsins, domainId);
    for (const product of products) {
      productMap.set(product.asin, product);
    }
  }

  console.error(`[products] productMap has ${productMap.size} entries`);

  // Step 4: assemble results — only include categories that had a bestseller ASIN
  const results: CategoryResult[] = [];

  for (let i = 0; i < categories.length; i++) {
    const asin = asinByCatIndex[i];
    if (!asin) continue;

    const product = productMap.get(asin);
    const tree = product?.categoryTree ?? [];
    const root = tree.length > 0 ? tree[0] : null;

    results.push({
      categoryId: categories[i].id,
      categoryName: categories[i].name,
      categoryPath: tree.map((c) => c.name).join(" > ") || categories[i].name,
      categoryRootId: root?.catId ?? null,
      categoryRootName: root?.name ?? null,
      bestSellerAsin: asin,
      bestSellerTitle: product?.title ?? null,
      bestSellerRootCategoryId: product?.rootCategory ?? null,
      bestSellerRootBsr: product
        ? extractBsr(product.salesRanks, product.rootCategory)
        : null,
    });
  }

  return results;
}
