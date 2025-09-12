import { openai } from "@ai-sdk/openai";
import { Agent } from "@voltagent/core";
import { VercelAIProvider } from "@voltagent/vercel-ai";
import { z } from "zod";
import { ingredientAnalysisTool } from "../tools";

/**
 * 食材分析
 */
export const IngredientAnalystAgent = new Agent({
	name: "ingredient-analyst-agent",
	instructions: `
    あなたはイタリア料理の食材分析に特化しています。
    **重要**: 必ずJSON形式でレスポンスしてください。Markdownや通常のテキスト形式は使用しないでください。
    
    食材の相性、地方性、提案カテゴリを必ず以下のJSON構造で返します：
    {
      "ingredientAnalysis": [
        {
          "ingredient": "食材名",
          "italianUsage": "イタリア料理での使用法",
          "seasonality": "季節性",
          "region": "関連する地方",
          "compatibilityScore": 数値(1-10)
        }
      ],
      "compatibility": {
        "overallScore": 全体的な相性スコア(1-10),
        "pairings": ["相性の良い組み合わせ"]
      },
      "suggestedDishTypes": ["パスタ", "リゾット", "ピッツァ"],
      "recommendedAdditions": [
        {
          "ingredient": "推奨追加食材",
          "reason": "追加理由",
          "priority": "高/中/低"
        }
      ],
      "difficultyAssessment": "難易度評価",
      "cookingMethods": ["調理法1", "調理法2"],
      "regionalSuggestions": [
        {
          "region": "地方名",
          "dishName": "料理名",
          "reason": "選択理由"
        }
      ]
    }
    
    評価は根拠を添えて、過度に曖昧な表現を避け、必ず上記のJSON構造でレスポンスしてください。
  `,
	parameters: z.object({
		ingredients: z.array(z.string()).describe("分析する食材"),
	}),
	llm: new VercelAIProvider(),
	model: openai("gpt-4o-mini"),
	tools: [ingredientAnalysisTool],
});
