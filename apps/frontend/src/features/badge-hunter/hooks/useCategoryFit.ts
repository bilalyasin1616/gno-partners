import { useQuery } from "@tanstack/react-query";
import { rateCategoryFit } from "../services/api";
import type { ProductInfo, CategoryOpportunity, CategoryFitScore } from "../types";

export function useCategoryFit(
  opportunities: CategoryOpportunity[],
  product: ProductInfo | undefined
) {
  const categories = opportunities.map((o) => ({ id: o.categoryId, path: o.categoryPath }));
  const categoryIds = categories.map((c) => c.id).join(",");

  const query = useQuery({
    queryKey: ["category-fit", categoryIds, product?.asin],
    queryFn: () =>
      rateCategoryFit(
        { title: product!.title, bulletPoints: product!.bulletPoints },
        categories
      ),
    enabled: opportunities.length > 0 && !!product,
    staleTime: 10 * 60 * 1000,
    retry: 1,
  });

  const fitScores = new Map<number, CategoryFitScore>();
  if (query.data) {
    for (const score of query.data) {
      fitScores.set(score.categoryId, score);
    }
  }

  return { fitScores, isFetching: query.isFetching };
}
