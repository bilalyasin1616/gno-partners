import "@supabase/functions-js/edge-runtime.d.ts";
import { json, corsPreflightResponse } from "../_shared/http.ts";
import { resolveDomainId } from "../_shared/keepa/keepa.util.ts";
import { fetchProduct } from "./keepa.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return corsPreflightResponse();

  try {
    const { asin, marketplace } = await req.json();

    if (!asin || typeof asin !== "string") {
      return json({ error: "asin is required" }, 400);
    }

    const domainId = resolveDomainId(marketplace);
    const product = await fetchProduct(asin, domainId);
    return json(product);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return json({ error: message }, 500);
  }
});
