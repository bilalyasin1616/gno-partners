import "@supabase/functions-js/edge-runtime.d.ts";
import { json, corsPreflightResponse } from "../_shared/http.ts";
import { resolveDomainId } from "../_shared/keepa/keepa.util.ts";
import { fetchRelevantCategories } from "./keepa.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return corsPreflightResponse();

  try {
    const { categoryTree, marketplace } = await req.json();

    if (!Array.isArray(categoryTree) || categoryTree.length === 0) {
      return json({ error: "categoryTree is required and must be a non-empty array" }, 400);
    }

    const domainId = resolveDomainId(marketplace);
    const categories = await fetchRelevantCategories(categoryTree, domainId);
    return json({ categories });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return json({ error: message }, 500);
  }
});
