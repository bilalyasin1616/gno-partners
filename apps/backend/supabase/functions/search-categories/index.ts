import "@supabase/functions-js/edge-runtime.d.ts";
import { json, corsPreflightResponse } from "../_shared/http.ts";
import { resolveDomainId } from "../_shared/keepa/keepa.util.ts";
import { searchCategories } from "./keepa.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return corsPreflightResponse();

  try {
    const { terms, marketplace } = await req.json();

    if (!Array.isArray(terms) || terms.length === 0) {
      return json({ error: "terms is required and must be a non-empty array" }, 400);
    }

    const invalidTerms = terms.filter((t) => typeof t !== "string" || t.trim().length < 3);
    if (invalidTerms.length > 0) {
      return json({ error: "Each term must be a string of at least 3 characters" }, 400);
    }

    const domainId = resolveDomainId(marketplace);
    const categories = await searchCategories(terms, domainId);
    return json({ categories });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return json({ error: message }, 500);
  }
});
