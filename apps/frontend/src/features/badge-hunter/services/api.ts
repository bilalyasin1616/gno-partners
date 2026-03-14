import { FunctionsHttpError } from "@supabase/supabase-js";
import type { ProductInfo, SearchCategory, CategoryResult, CategoryFitScore, SalesEstimates } from "../types";
import { supabase } from "../../../lib/supabase";

async function invoke<T>(fn: string, body: Record<string, unknown>): Promise<T> {
  const { data, error } = await supabase.functions.invoke<T>(fn, { body });
  if (error) {
    if (error instanceof FunctionsHttpError) {
      const json = await error.context.json();
      throw new Error(json.error ?? error.message);
    }
    throw error;
  }
  return data as T;
}

export function lookupProduct(asin: string, marketplace: string): Promise<ProductInfo> {
  return invoke("product-lookup", { asin, marketplace });
}

export async function extractSearchTerms(
  title: string,
  bulletPoints: string[]
): Promise<string[]> {
  const data = await invoke<{ terms: string[] }>("extract-search-terms", { title, bulletPoints });
  return data.terms;
}

export async function searchCategories(
  terms: string[],
  marketplace: string
): Promise<SearchCategory[]> {
  const data = await invoke<{ categories: SearchCategory[] }>("search-categories", { terms, marketplace });
  return data.categories;
}

export async function compareCategories(
  categories: { id: number; name: string }[],
  marketplace: string
): Promise<CategoryResult[]> {
  const data = await invoke<{ results: CategoryResult[] }>("compare-categories", { categories, marketplace });
  return data.results;
}

export async function rateCategoryFit(
  product: { title: string; bulletPoints: string[] },
  categories: { id: number; path: string }[]
): Promise<CategoryFitScore[]> {
  const data = await invoke<{ scores: CategoryFitScore[] }>("rate-category-fit", { product, categories });
  return data.scores;
}

export async function fetchSerpCategories(
  searchTerms: string[],
  marketplace: string
): Promise<{ id: number; name: string; path: string }[]> {
  const data = await invoke<{ categories: { id: number; name: string; path: string }[] }>("serp-categories", { searchTerms, marketplace });
  return data.categories;
}

export async function fetchSalesEstimates(
  asins: string[],
  marketplace: string
): Promise<SalesEstimates> {
  const data = await invoke<{ estimates: SalesEstimates }>("sales-estimation", { asins, marketplace });
  return data.estimates;
}
