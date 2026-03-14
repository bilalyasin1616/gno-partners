import { useQuery } from "@tanstack/react-query";
import { extractSearchTerms } from "../services/api";
import type { ProductInfo } from "../types";

export function useSearchTerms(product: ProductInfo | undefined) {
  return useQuery({
    queryKey: ["search-terms", product?.asin],
    queryFn: () => extractSearchTerms(product!.title, product!.bulletPoints),
    enabled: !!product,
    staleTime: 10 * 60 * 1000,
    retry: 1,
  });
}
