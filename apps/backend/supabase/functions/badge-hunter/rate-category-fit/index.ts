import "@supabase/functions-js/edge-runtime.d.ts";
import { generateObject } from "npm:ai@^4";
import { z } from "npm:zod@^3";
import { json, corsPreflightResponse } from "../_shared/http.ts";
import { getLLMModel } from "../_shared/llm.ts";

const schema = z.object({
  scores: z.array(
    z.object({
      categoryId: z.number(),
      fitPercent: z.number().min(0).max(100),
      reason: z.string(),
    })
  ),
});

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return corsPreflightResponse();

  try {
    const { product, categories } = await req.json();

    if (!product?.title || typeof product.title !== "string") {
      return json({ error: "product.title is required" }, 400);
    }
    if (!Array.isArray(categories) || categories.length === 0) {
      return json({ error: "categories array is required" }, 400);
    }

    const bullets: string[] = Array.isArray(product.bulletPoints)
      ? product.bulletPoints
      : [];

    const categoryList = categories
      .slice(0, 30)
      .map((c: { id: number; path: string }) => `- ID ${c.id}: ${c.path}`)
      .join("\n");

    const model = getLLMModel();

    const { object } = await generateObject({
      model,
      schema,
      prompt: `You are an Amazon category analyst. Given a product and a list of Amazon categories (shown as full root-to-leaf paths), rate how well the product fits each category on a scale of 0-100.

Scoring guide:
- 90-100: Product is a perfect, direct fit for this category
- 70-89: Product clearly belongs in this category
- 40-69: Product partially fits but is not ideal
- 20-39: Weak fit, product is tangentially related
- 0-19: Product does not belong in this category

Product title: ${product.title}
Key features: ${bullets.slice(0, 5).join(" | ")}

Categories to rate:
${categoryList}

Return a score and brief reason for each category. Use the exact category IDs provided.`,
    });

    return json({ scores: object.scores });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return json({ error: message }, 500);
  }
});
