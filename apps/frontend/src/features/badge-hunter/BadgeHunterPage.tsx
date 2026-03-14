import { useState } from "react";
import { Navbar } from "../../shared/components/Navbar";
import { AsinInput } from "./components/AsinInput";
import { ProductCard } from "./components/ProductCard";
import { useProductLookup } from "./hooks/useProductLookup";
import { useSearchTerms } from "./hooks/useSearchTerms";
import { useCategorySearch } from "./hooks/useCategorySearch";
import { useBestSellerComparison } from "./hooks/useBestSellerComparison";
import { useCategoryFit } from "./hooks/useCategoryFit";
import { useSalesEstimates } from "./hooks/useSalesEstimates";
import { useSerpCategories } from "./hooks/useSerpCategories";
import type { MarketplaceCode } from "./types";

export function BadgeHunterPage() {
  const [lookupParams, setLookupParams] = useState<{
    asin: string;
    marketplace: MarketplaceCode;
    searchTerms?: string[];
  } | null>(null);

  const {
    data: product,
    isFetching: productFetching,
    error: productError,
  } = useProductLookup(lookupParams);
  const { data: terms, isFetching: termsFetching } = useSearchTerms(product);
  const { data: categories, isFetching: categoriesFetching } =
    useCategorySearch(terms, lookupParams?.marketplace ?? "US");
  const { data: serpCategories, isFetching: serpFetching } = useSerpCategories(
    lookupParams?.searchTerms,
    lookupParams?.marketplace ?? "US"
  );
  // If search terms were provided, wait for SERP to finish before comparing
  const serpReady = !lookupParams?.searchTerms || !!serpCategories;
  const { opportunities, isFetching: comparisonFetching } =
    useBestSellerComparison(
      serpReady ? categories : undefined,
      product,
      lookupParams?.marketplace ?? "US",
      serpCategories
    );
  const { fitScores, isFetching: fitFetching } = useCategoryFit(
    opportunities,
    product
  );
  const { salesEstimates, isFetching: salesFetching } = useSalesEstimates(
    opportunities,
    product,
    lookupParams?.marketplace ?? "US"
  );

  const isLoading =
    productFetching ||
    termsFetching ||
    categoriesFetching ||
    serpFetching ||
    comparisonFetching;

  const steps = [
    { label: "Looking up product", done: !!product, active: productFetching },
    ...(lookupParams?.searchTerms
      ? [
          {
            label: "Search term categories",
            done: !!serpCategories,
            active: serpFetching,
          },
        ]
      : []),
    { label: "Extracting search terms", done: !!terms, active: termsFetching },
    {
      label: "Searching categories",
      done: !!categories,
      active: categoriesFetching,
    },
    {
      label: "Comparing best sellers",
      done: opportunities.length > 0,
      active: comparisonFetching,
    },
  ];
  const pipelineStarted = isLoading || !!product;

  return (
    <div className="min-h-screen bg-cream">
      <Navbar toolName="Badge Hunter" />

      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Badge Hunter</h1>
          <p className="mt-1 text-gray-500">
            Find Amazon categories where you can win the Best Seller badge
          </p>
        </div>

        <AsinInput
          onSubmit={(asin, marketplace, searchTerms) =>
            setLookupParams({ asin, marketplace, searchTerms })
          }
          isLoading={isLoading}
        />

        {pipelineStarted && (
          <div className="mt-6 flex items-center justify-center gap-3">
            {steps.map((step, i) => (
              <div key={i} className="flex items-center gap-1.5">
                {step.done ? (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-[10px] text-white">
                    &#10003;
                  </span>
                ) : step.active ? (
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
                ) : (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-200 text-[10px] text-gray-400">
                    {i + 1}
                  </span>
                )}
                <span
                  className={`text-xs ${
                    step.active
                      ? "font-medium text-blue-600"
                      : step.done
                      ? "text-green-700"
                      : "text-gray-400"
                  }`}
                >
                  {step.label}
                </span>
                {i < steps.length - 1 && (
                  <span className="ml-2 text-gray-300">―</span>
                )}
              </div>
            ))}
          </div>
        )}

        {productError && (
          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {(productError as Error).message}
          </div>
        )}

        {product && (
          <div className="mt-6">
            <ProductCard product={product} />
          </div>
        )}

        {opportunities.length > 0 && (
          <div className="mt-8">
            <h2 className="mb-3 text-lg font-semibold text-gray-900">
              Badge Opportunities
              <span className="ml-2 text-sm font-normal text-gray-400">
                {opportunities.filter((o) => o.winnable).length} winnable of{" "}
                {opportunities.length}
              </span>
            </h2>
            <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
              <table className="w-full text-sm">
                <thead className="border-b border-gray-100 bg-gray-50 text-xs font-medium uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="px-4 py-3 text-left min-w-[200px]">
                      Category
                    </th>
                    <th className="px-4 py-3 text-center">% Fit</th>
                    <th className="px-4 py-3 text-right">Products</th>
                    <th className="px-4 py-3 text-left">Best Seller</th>
                    <th className="px-4 py-3 text-right">Their BSR</th>
                    <th className="px-4 py-3 text-right">Our BSR</th>
                    <th className="px-4 py-3 text-right">Gap</th>
                    <th className="px-4 py-3 text-center">Same Root?</th>
                    <th className="px-4 py-3 text-center">Winnable?</th>
                    <th className="px-4 py-3 text-right">Our Sales</th>
                    <th className="px-4 py-3 text-right">Their Sales</th>
                    <th className="px-4 py-3 text-right">Sales Gap</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {opportunities.map((o) => (
                    <tr key={o.categoryId} className="hover:bg-gray-50">
                      <td className="px-4 py-3 min-w-[200px]">
                        <span className="font-medium text-gray-800">
                          {o.categoryName}
                        </span>
                        <p className="mt-0.5 text-xs text-gray-400">
                          {o.categoryPath}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {(() => {
                          const fit = fitScores.get(o.categoryId);
                          if (!fit) {
                            return fitFetching ? (
                              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
                            ) : (
                              <span className="text-xs text-gray-400">—</span>
                            );
                          }
                          const pct = fit.fitPercent;
                          const color =
                            pct >= 70
                              ? "text-green-600"
                              : pct >= 40
                              ? "text-amber-600"
                              : "text-red-500";
                          return (
                            <span
                              className={`text-xs font-medium ${color}`}
                              title={fit.reason}
                            >
                              {pct}%
                            </span>
                          );
                        })()}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-600">
                        {o.productCount.toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <a
                          href={`https://www.amazon.com/dp/${o.bestSellerAsin}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-xs text-blue-600 hover:underline"
                        >
                          {o.bestSellerAsin}
                        </a>
                        {o.bestSellerTitle && (
                          <p className="mt-0.5 line-clamp-1 text-xs text-gray-400">
                            {o.bestSellerTitle}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-600">
                        {o.bestSellerRootBsr.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-600">
                        {o.ourBsr.toLocaleString()}
                      </td>
                      <td
                        className={`px-4 py-3 text-right font-medium ${
                          o.winnable ? "text-green-600" : "text-red-500"
                        }`}
                      >
                        {o.bsrGap > 0 ? "+" : ""}
                        {o.bsrGap.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {o.sameRoot ? (
                          <span className="inline-block rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                            Yes
                          </span>
                        ) : (
                          <span className="inline-block rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                            {o.categoryRootName ?? "Different"}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {o.winnable ? (
                          <span className="inline-block rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                            Yes
                          </span>
                        ) : (
                          <span className="inline-block rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
                            No
                          </span>
                        )}
                      </td>
                      {(() => {
                        const ourSales = product
                          ? salesEstimates[product.asin]?.monthlySales
                          : undefined;
                        const theirSales =
                          salesEstimates[o.bestSellerAsin]?.monthlySales;
                        const spinner = salesFetching ? (
                          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        );
                        const salesGap =
                          ourSales != null && theirSales != null
                            ? ourSales - theirSales
                            : undefined;
                        return (
                          <>
                            <td className="px-4 py-3 text-right text-gray-600">
                              {ourSales != null
                                ? ourSales.toLocaleString()
                                : spinner}
                            </td>
                            <td className="px-4 py-3 text-right text-gray-600">
                              {theirSales != null
                                ? theirSales.toLocaleString()
                                : spinner}
                            </td>
                            <td
                              className={`px-4 py-3 text-right font-medium ${
                                salesGap != null
                                  ? salesGap > 0
                                    ? "text-green-600"
                                    : "text-red-500"
                                  : ""
                              }`}
                            >
                              {salesGap != null ? (
                                <>
                                  {salesGap > 0 ? "+" : ""}
                                  {salesGap.toLocaleString()}
                                </>
                              ) : (
                                spinner
                              )}
                            </td>
                          </>
                        );
                      })()}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
