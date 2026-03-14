import { useQuery } from "@tanstack/react-query";
import { searchCategories } from "../services/api";
import type { MarketplaceCode } from "../types";

export function useCategorySearch(terms: string[] | undefined, marketplace: MarketplaceCode) {
  return useQuery({
    queryKey: ["category-search", ...(terms ?? []), marketplace],
    queryFn: () => searchCategories(terms!, marketplace),
    enabled: !!terms && terms.length > 0,
    staleTime: 10 * 60 * 1000,
    retry: 1,
  });
}
