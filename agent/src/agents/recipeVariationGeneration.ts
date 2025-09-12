import { openai } from "@ai-sdk/openai";
import { Agent } from "@voltagent/core";
import { VercelAIProvider } from "@voltagent/vercel-ai";
import { z } from "zod";
import { recipeVariationGenerationTool } from "../tools";


/**
 * レシピのバリエーション生成
 */
export const RecipeVariationGenerationAgent = new Agent({
	name: "recipe-variation-generation-agent",
	instructions: `
    あなたはイタリアンレシピのバリエーション作成に特化しています。
    与えられたオリジナルレシピとバリエーションの要件に基づいて、新しいレシピを生成してください。
  `,
	parameters: z.object({
		baseRecipe: z.string().describe("ベースとなるレシピ"),
    variationTypeList: z.array(z.string()).describe("生成したいバリエーションのタイプ"),
	}),
	llm: new VercelAIProvider(),
	model: openai("gpt-4o-mini"),
  tools: [recipeVariationGenerationTool],
});
