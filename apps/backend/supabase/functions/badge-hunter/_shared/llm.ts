import { createAnthropic } from "npm:@ai-sdk/anthropic@^1";
import { createOpenAI } from "npm:@ai-sdk/openai@^1";
import type { LanguageModelV1 } from "npm:ai@^4";

export function getLLMModel(): LanguageModelV1 {
  const provider = Deno.env.get("LLM_PROVIDER") ?? "anthropic";
  const modelId = Deno.env.get("LLM_MODEL") ?? "claude-haiku-4-5-20251001";

  if (provider === "openai") {
    const apiKey = Deno.env.get("OPENAI_API_KEY");
    if (!apiKey) throw new Error("OPENAI_API_KEY not configured");
    return createOpenAI({ apiKey })(modelId);
  }

  // Support both ANTHROPIC_API_KEY and CLAUDE_API_KEY
  const apiKey = Deno.env.get("ANTHROPIC_API_KEY") ?? Deno.env.get("CLAUDE_API_KEY");
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY (or CLAUDE_API_KEY) not configured");
  return createAnthropic({ apiKey })(modelId);
}
