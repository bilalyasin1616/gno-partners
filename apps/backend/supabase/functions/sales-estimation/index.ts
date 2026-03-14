import "@supabase/functions-js/edge-runtime.d.ts";
import { json, corsPreflightResponse } from "../_shared/http.ts";
import { resolveAmazonDomain } from "../_shared/rainforest/rainforest.util.ts";
import { fetchSalesEstimate } from "../_shared/rainforest/rainforest.api.ts";
import type { SalesEstimateResult } from "../_shared/rainforest/rainforest.type.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return corsPreflightResponse();

  try {
    const { asins, marketplace } = await req.json();

    if (!Array.isArray(asins) || asins.length === 0) {
      return json({ error: "asins array is required" }, 400);
    }

    const amazonDomain = resolveAmazonDomain(marketplace);

    // Deduplicate and cap at 30
    const uniqueAsins = [...new Set(asins as string[])].slice(0, 30);
    console.error(`[sales] fetching estimates for ${uniqueAsins.length} ASINs on ${amazonDomain}`);

    const settled = await Promise.allSettled(
      uniqueAsins.map((asin) => fetchSalesEstimate(asin, amazonDomain))
    );

    const estimates: Record<string, SalesEstimateResult> = {};
    for (let i = 0; i < uniqueAsins.length; i++) {
      const result = settled[i];
      if (result.status === "fulfilled" && result.value) {
        estimates[uniqueAsins[i]] = result.value;
      }
    }

    return json({ estimates });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return json({ error: message }, 500);
  }
});
