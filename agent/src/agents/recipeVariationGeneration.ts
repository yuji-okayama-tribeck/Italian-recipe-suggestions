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
    **重要**: 必ずJSON形式でレスポンスしてください。Markdownや通常のテキスト形式は使用しないでください。
    
    指定のスタイル（ベジタリアン、グルテンフリー等）に沿った変更案を必ず以下のJSON構造で返します：
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
    
    代替食材の根拠と、オリジナルからの差分を明確に示し、必ず上記のJSON構造でレスポンスしてください。
  `,
	parameters: z.object({
		baseRecipe: z.string().describe("ベースとなるレシピ名または説明"),
		variationType: z
			.enum(["vegetarian", "vegan", "gluten-free", "spicy", "creamy", "light"])
			.describe("バリエーション種類"),
		additionalIngredients: z.array(z.string()).optional().describe("追加食材"),
	}),
	llm: new VercelAIProvider(),
	model: openai("gpt-4o-mini"),
	tools: [recipeVariationGenerationTool],
});
