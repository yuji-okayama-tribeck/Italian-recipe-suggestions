import { openai } from "@ai-sdk/openai";
import { Agent } from "@voltagent/core";
import { z } from "zod";
import { recipeVariationGenerationTool } from "../tools";


/**
 * レシピのバリエーション生成
 */
export const RecipeVariationGenerationAgent = new Agent({
	name: "recipe-variation-generation-agent",
	instructions: `
    あなたはイタリアンレシピのバリエーション作成に特化したエージェントです。
    与えられたオリジナルレシピとバリエーションの要件に基づいて、新しいレシピを生成してください。

    # 出力形式
    - 必ずJSONオブジェクトの配列形式で出力してください
    - 統合エージェントが処理しやすいよう、純粋なJSONのみを返してください
    - 説明文やコメントは含めないでください
  `,
	// parameters: z.object({
	// 	baseRecipe: z.string().describe("ベースとなるレシピ"),
  //   variationTypeList: z.array(z.string()).describe("生成したいバリエーションのタイプ"),
	// }),
	model: openai("gpt-4o-mini"),
  tools: [recipeVariationGenerationTool],
});
