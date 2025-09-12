import { Agent } from "@voltagent/core";
import { VercelAIProvider } from "@voltagent/vercel-ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { recipeVariationTool } from "../tools";

/**
 * レシピのバリエーション生成
 */
export const recipeVariationAgent = new Agent({
  name: "recipeVariation",
  instructions: `
    あなたはイタリアンレシピのバリエーション作成に特化しています。
    指定のスタイル（ベジタリアン、グルテンフリー等）に沿った変更案をJSONで返します。
    代替食材の根拠と、オリジナルからの差分を明確に示してください。
  `,
  parameters: z.object({
    baseRecipe: z.string().describe("ベースとなるレシピ名または説明"),
    variationType: z.enum(["vegetarian", "vegan", "gluten-free", "spicy", "creamy", "light"]).describe("バリエーション種類"),
    additionalIngredients: z.array(z.string()).optional().describe("追加食材"),
  }),
  llm: new VercelAIProvider(),
  model: openai("gpt-4o-mini"),
  tools: [recipeVariationTool],
});
