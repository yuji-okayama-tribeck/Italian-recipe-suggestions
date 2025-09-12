import { openai } from "@ai-sdk/openai";
import { Agent } from "@voltagent/core";
import { VercelAIProvider } from "@voltagent/vercel-ai";
import { z } from "zod";
import { recipeGenerationTool } from "../tools";

/**
 * レシピ生成
 */
export const RecipeGenerationAgent = new Agent({
  name: "recipe-generation-agent",
  instructions: `
    あなたはイタリアンのレシピ生成に特化しています。
    食材から、本格的で家庭で再現可能なレシピを作成してください。
  `,
  parameters: z.object({
    ingredients: z.array(z.string()).describe("食材"),
  }),
  llm: new VercelAIProvider(),
  model: openai("gpt-4o-mini"),
  tools: [recipeGenerationTool],
});
