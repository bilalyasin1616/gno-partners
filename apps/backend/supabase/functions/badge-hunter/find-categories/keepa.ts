import type { FlatCategory, InputCategoryNode } from "./types.ts";
import type { KeepaCategory } from "../_shared/keepa/keepa.type.ts";
import { fetchKeepaCategories } from "../_shared/keepa/keepa.api.ts";

// How many levels from the leaf to use as the pivot.
// For a 6-level tree [root, L1, L2, L3, L4, leaf], PIVOT_DEPTH_FROM_LEAF=3 → L3
const PIVOT_DEPTH_FROM_LEAF = 3;

export async function fetchRelevantCategories(
  categoryTree: InputCategoryNode[],
  domainId: number
): Promise<FlatCategory[]> {
  if (categoryTree.length < 2) return [];

  // Pick pivot node — 3 levels from the leaf, or the shallowest non-root node
  const pivotIndex = Math.max(1, categoryTree.length - PIVOT_DEPTH_FROM_LEAF);
  const pivot = categoryTree[pivotIndex];

  // Level 1: fetch pivot itself to get its children IDs
  const pivotData = await fetchKeepaCategories([pivot.id], domainId);
  const pivotCategory = pivotData[pivot.id];
  if (!pivotCategory || !pivotCategory.children?.length) return [];

  // Cap level-1 to avoid too many downstream calls
  const level1Ids = pivotCategory.children.slice(0, 20);

  // Level 2: fetch each level-1 child (one call each)
  const level1Data = await fetchKeepaCategories(level1Ids, domainId);
  const level1Categories = Object.values(level1Data);

  // Level 3: collect grandchild IDs, cap to keep total calls reasonable
  const level2Ids = level1Categories.flatMap((c) => c.children ?? []).filter((id): id is number => id > 0).slice(0, 30);

  const level2Data = level2Ids.length > 0
    ? await fetchKeepaCategories(level2Ids, domainId)
    : {};

  // Build flat list with paths relative to the pivot
  const results: FlatCategory[] = [];

  for (const l1 of level1Categories) {
    results.push({
      id: l1.catId,
      name: l1.name,
      path: `${pivot.name} › ${l1.name}`,
      level: 1,
      productCount: l1.productCount ?? 0,
    });

    const l2Children = (l1.children ?? [])
      .map((id) => level2Data[id])
      .filter((c): c is KeepaCategory => !!c);

    for (const l2 of l2Children) {
      results.push({
        id: l2.catId,
        name: l2.name,
        path: `${pivot.name} › ${l1.name} › ${l2.name}`,
        level: 2,
        productCount: l2.productCount ?? 0,
      });
    }
  }

  return results;
}
