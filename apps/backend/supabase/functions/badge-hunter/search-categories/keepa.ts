import type { SearchCategory } from "./types.ts";
import { searchKeepaCategories } from "../_shared/keepa/keepa.api.ts";

export async function searchCategories(
  terms: string[],
  domainId: number
): Promise<SearchCategory[]> {
  // Run all term searches in parallel (up to 5)
  const searches = terms.slice(0, 5).map((term) =>
    searchByTerm(term, domainId)
  );

  const results = await Promise.all(searches);

  // Deduplicate by catId — first occurrence wins
  const seen = new Set<number>();
  const categories: SearchCategory[] = [];

  for (const batch of results) {
    for (const cat of batch) {
      if (!seen.has(cat.id)) {
        seen.add(cat.id);
        categories.push(cat);
      }
    }
  }

  return categories;
}

async function searchByTerm(
  term: string,
  domainId: number
): Promise<SearchCategory[]> {
  const categories = await searchKeepaCategories(term, domainId);

  return Object.values(categories)
    .filter((cat) => cat.productCount > 0 && cat.lowestRank > 0)
    .map((cat) => ({
      id: cat.catId,
      name: cat.name,
      path: cat.name, // Keepa search doesn't return full path — name is what's available
      lowestRank: cat.lowestRank,
      highestRank: cat.highestRank,
      productCount: cat.productCount,
    }));
}
