import "@supabase/functions-js/edge-runtime.d.ts";
import { json, corsPreflightResponse } from "../_shared/http.ts";
import { resolveDomainId } from "../_shared/keepa/keepa.util.ts";
import { compareCategoriesWithBestSellers } from "./keepa.ts";
import type { CategoryInput } from "./types.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return corsPreflightResponse();

  try {
    const { categories, marketplace } = await req.json();

    if (!Array.isArray(categories) || categories.length === 0) {
      return json(
        { error: "categories is required and must be a non-empty array" },
        400
      );
    }

    const capped: CategoryInput[] = categories.slice(0, 50);

    const domainId = resolveDomainId(marketplace);
    const results = await compareCategoriesWithBestSellers(capped, domainId);
    return json({ results });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return json({ error: message }, 500);
  }
});
