import { useQuery } from "@tanstack/react-query";
import { compareCategories } from "../services/api";
import { getEffectiveBsr } from "../utils/bsr";
import type {
  SearchCategory,
  CategoryResult,
  CategoryOpportunity,
  MarketplaceCode,
  ProductInfo,
} from "../types";

interface SerpCategory {
  id: number;
  name: string;
  path: string;
}

function computeOpportunities(
  results: CategoryResult[],
  product: ProductInfo,
  allCategories: { id: number; name: string; productCount: number }[],
  effectiveBsr: number
): CategoryOpportunity[] {
  const ourBsr = effectiveBsr;
  const productCountMap = new Map(allCategories.map((c) => [c.id, c.productCount]));

  return results
    .filter(
      (r): r is CategoryResult & { bestSellerAsin: string; bestSellerRootBsr: number } =>
        r.bestSellerAsin !== null && r.bestSellerRootBsr !== null
    )
    .map((r) => {
      const sameRoot =
        product.rootCategoryId !== null &&
        r.categoryRootId === product.rootCategoryId;
      const bsrGap = r.bestSellerRootBsr - ourBsr;
      return {
        categoryId: r.categoryId,
        categoryName: r.categoryName,
        categoryPath: r.categoryPath,
        categoryRootName: r.categoryRootName,
        productCount: productCountMap.get(r.categoryId) ?? 0,
        bestSellerAsin: r.bestSellerAsin,
        bestSellerTitle: r.bestSellerTitle ?? "",
        bestSellerRootBsr: r.bestSellerRootBsr,
        ourBsr,
        sameRoot,
        bsrGap,
        winnable: bsrGap > 0,
      };
    })
    .sort((a, b) => {
      if (a.winnable !== b.winnable) return a.winnable ? -1 : 1;
      return b.bsrGap - a.bsrGap;
    });
}

/**
 * Merge SERP categories (first) with Keepa categories, deduped by ID.
 * SERP categories don't have productCount/rank data so we assign 0.
 */
function mergeCategories(
  serpCategories: SerpCategory[] | undefined,
  keepaCategories: SearchCategory[] | undefined
): { id: number; name: string; productCount: number }[] {
  const seen = new Set<number>();
  const merged: { id: number; name: string; productCount: number }[] = [];

  // SERP categories first
  for (const cat of serpCategories ?? []) {
    if (seen.has(cat.id)) continue;
    seen.add(cat.id);
    merged.push({ id: cat.id, name: cat.name, productCount: 0 });
  }

  // Then Keepa categories
  for (const cat of keepaCategories ?? []) {
    if (seen.has(cat.id)) continue;
    seen.add(cat.id);
    merged.push({ id: cat.id, name: cat.name, productCount: cat.productCount });
  }

  return merged;
}

export function useBestSellerComparison(
  categories: SearchCategory[] | undefined,
  product: ProductInfo | undefined,
  marketplace: MarketplaceCode,
  serpCategories?: SerpCategory[]
) {
  const allCategories = mergeCategories(serpCategories, categories);

  // Cap to 50 before sending to the edge function
  const topCategories = allCategories
    .slice(0, 50)
    .map(({ id, name }) => ({ id, name }));

  const effectiveBsr = product ? getEffectiveBsr(product) : null;

  const query = useQuery({
    queryKey: ["best-seller-comparison", topCategories.map((c) => c.id).join(","), marketplace],
    queryFn: () => compareCategories(topCategories, marketplace),
    enabled: topCategories.length > 0 && effectiveBsr !== null,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const opportunities = query.data && product && allCategories.length > 0 && effectiveBsr !== null
    ? computeOpportunities(query.data, product, allCategories, effectiveBsr)
    : [];

  return { ...query, opportunities };
}
