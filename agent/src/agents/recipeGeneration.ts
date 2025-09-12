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
    **重要**: 必ずJSON形式でレスポンスしてください。Markdownや通常のテキスト形式は使用しないでください。
    
    与えられた条件から、本格的で家庭で再現可能なレシピを必ず以下のJSON構造で返します：
    {
      "mainRecipe": {
        "recipeName": "レシピ名",
        "description": "料理の説明",
        "ingredients": [{"name": "食材名", "amount": "分量", "unit": "日本語単位"}],
        "instructions": ["手順1", "手順2"],
        "cookingTime": 調理時間(分),
        "difficulty": "難易度",
        "servings": 人数分,
        "tips": ["調理のコツ1", "調理のコツ2"],
        "cuisine": "Italian",
        "region": "イタリアの地方（もしあれば）",
        "winePairing": "おすすめワイン"
      },
      "variations": [
        {
          "variationName": "バリエーション名",
          "modificationType": "バリエーションタイプ",
          "ingredients": [{"name": "食材名", "amount": "分量", "unit": "日本語単位", "substitution": false}],
          "instructions": ["手順1", "手順2"],
          "substitutions": [{"original": "元の食材", "replacement": "代替食材", "reason": "理由"}],
          "nutritionalBenefits": "栄養面での利点",
          "difficulty": "難易度",
          "cookingTime": 調理時間(分),
          "cuisine": "Italian"
        }
      ],
      "metadata": {
        "generatedAt": "生成日時",
        "language": "ja",
        "format": "JSON",
        "workflowVersion": "1.0"
      }
    }
    
    単位は日本語表記に統一（大さじ、小さじ、カップ、g、ml等）し、手順は具体的・簡潔にしてください。
    必ず上記のJSON構造でレスポンスしてください。
  `,
	parameters: z.object({
		prompt: z.string().describe("ユーザーからの入力プロンプト"),
	}),
	llm: new VercelAIProvider(),
	model: openai("gpt-4o-mini"),
	tools: [recipeGenerationTool],
});
