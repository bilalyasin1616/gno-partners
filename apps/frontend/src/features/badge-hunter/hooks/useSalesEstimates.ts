import { useQuery } from "@tanstack/react-query";
import { fetchSalesEstimates } from "../services/api";
import type { ProductInfo, CategoryOpportunity, SalesEstimates, MarketplaceCode } from "../types";

export function useSalesEstimates(
  opportunities: CategoryOpportunity[],
  product: ProductInfo | undefined,
  marketplace: MarketplaceCode
) {
  const asins = product
    ? [product.asin, ...opportunities.map((o) => o.bestSellerAsin)]
    : [];
  const uniqueAsins = [...new Set(asins)].sort();

  const query = useQuery({
    queryKey: ["sales-estimates", uniqueAsins.join(","), marketplace],
    queryFn: () => fetchSalesEstimates(uniqueAsins, marketplace),
    enabled: opportunities.length > 0 && !!product,
    staleTime: 10 * 60 * 1000,
    retry: 1,
  });

  return {
    salesEstimates: query.data ?? ({} as SalesEstimates),
    isFetching: query.isFetching,
  };
}
