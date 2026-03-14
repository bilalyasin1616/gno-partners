import { useQuery } from "@tanstack/react-query";
import { fetchSerpCategories } from "../services/api";
import type { MarketplaceCode } from "../types";

export function useSerpCategories(
  searchTerms: string[] | undefined,
  marketplace: MarketplaceCode
) {
  return useQuery({
    queryKey: ["serp-categories", ...(searchTerms ?? []), marketplace],
    queryFn: () => fetchSerpCategories(searchTerms!, marketplace),
    enabled: !!searchTerms && searchTerms.length > 0,
    staleTime: 10 * 60 * 1000,
    retry: 1,
  });
}
