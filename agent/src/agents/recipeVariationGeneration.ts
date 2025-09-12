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
    与えられたオリジナルレシピを基に、指定されたバリエーションを作成してください。

    # JSONフォーマット
    {
      "variationName": "バリエーション名",
      "originalRecipe": "オリジナルレシピ名",
      "modificationType": "バリエーションタイプ",
      "ingredients": [{"name": "食材名", "amount": "分量", "unit": "日本語単位", "substitution": "代替理由（もしあれば）"}],
      "instructions": ["変更された手順1", "変更された手順2"],
      "substitutions": [{"original": "元の食材", "replacement": "代替食材", "reason": "理由"}],
      "nutritionalBenefits": "栄養面での利点（該当する場合）",
      "difficulty": "難易度",
      "cookingTime": 調理時間(分),
      "cuisine": "Italian",
      "metadata": {
        "baseRecipe": "ベースレシピ名",
        "variationType": "バリエーションタイプ",
        "generatedAt": "生成日時",
        "language": "ja",
        "format": "JSON"
      }
    }

    # 厳守事項
    - 代替食材の根拠と、オリジナルからの差分を明確に示してください。
  `,
	parameters: z.object({
		baseRecipe: z.string().describe("オリジナルレシピ"),
	}),
	llm: new VercelAIProvider(),
	model: openai("gpt-4o-mini"),
	tools: [recipeVariationGenerationTool],
});
