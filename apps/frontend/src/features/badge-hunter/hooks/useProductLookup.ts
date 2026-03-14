import { useQuery } from "@tanstack/react-query";
import { lookupProduct } from "../services/api";
import type { MarketplaceCode } from "../types";

interface Params {
  asin: string;
  marketplace: MarketplaceCode;
}

export function useProductLookup(params: Params | null) {
  return useQuery({
    queryKey: ["product-lookup", params?.asin, params?.marketplace],
    queryFn: () => lookupProduct(params!.asin, params!.marketplace),
    enabled: !!params,
    staleTime: 5 * 60 * 1000, // 5 minutes — Keepa data doesn't change that fast
    retry: 1,
  });
}
