import "@supabase/functions-js/edge-runtime.d.ts";
import { generateObject } from "npm:ai@^4";
import { z } from "npm:zod@^3";
import { json, corsPreflightResponse } from "../_shared/http.ts";
import { getLLMModel } from "../_shared/llm.ts";

const schema = z.object({
  terms: z.array(z.string()).length(5),
});

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return corsPreflightResponse();

  try {
    const { title, bulletPoints } = await req.json();

    if (!title || typeof title !== "string") {
      return json({ error: "title is required" }, 400);
    }

    const bullets: string[] = Array.isArray(bulletPoints) ? bulletPoints : [];
    const model = getLLMModel();

    const { object } = await generateObject({
      model,
      schema,
      prompt: `You are helping an Amazon seller find categories where they can win the Best Seller badge.

Extract exactly 5 Amazon category search terms for this product. Each term must:
- Be 1-2 words that reflect Amazon category names (not brand names or model numbers)
- Cover different angles: product type, material, use case, style, or target audience
- Be general enough to match a category, not a specific listing

Product title: ${title}
Key features: ${bullets.slice(0, 5).join(" | ")}

Return exactly 5 search terms as an array of strings.`,
    });

    return json({ terms: object.terms });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return json({ error: message }, 500);
  }
});
