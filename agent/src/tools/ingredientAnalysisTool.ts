import { createTool } from "@voltagent/core";
import { z } from "zod";

/**
 * 食材分析ツール
 */
export const ingredientAnalysisTool = createTool({
	name: "ingredientAnalysisTool",
	description: "イタリア料理への食材の適性を分析し、組み合わせを提案する",
	parameters: z.object({
		ingredients: z.array(z.string()).describe("分析する食材"),
	}),
	execute: async ({ ingredients }) => {
		const analysisPrompt = `
      以下の食材についてイタリア料理への適性を分析してください：${ingredients.join("、")}

      以下を含む分析を提供してください：
      - 各食材の伝統的なイタリア料理での使用法
      - 食材間の相性評価
      - 提案されるイタリア料理のカテゴリ（パスタ、リゾット、ピッツァなど）
      - 季節性の考慮
      - イタリア地方別のバリエーション
      - この組み合わせを補完する不足食材

      必須：レスポンスはJSON形式で以下の構造に従ってください：
      {
        "ingredientAnalysis": [
          {
            "ingredient": "食材名",
            "italianUsage": "イタリア料理での使用法",
            "seasonality": "季節性",
            "region": "関連する地方",
            "compatibilityScore": 数値（1-10）
          }
        ],
        "compatibility": {
          "overallScore": 全体的な相性スコア（1-10）,
          "pairings": ["相性の良い組み合わせ"]
        },
        "suggestedDishTypes": ["パスタ", "リゾット", "ピッツァ", ...],
        "recommendedAdditions": [
          {
            "ingredient": "推奨追加食材",
            "reason": "追加理由",
            "priority": "高/中/低"
          }
        ],
        "difficultyAssessment": "難易度評価",
        "cookingMethods": ["調理法1", "調理法2", ...],
        "regionalSuggestions": [
          {
            "region": "地方名",
            "dishName": "料理名",
            "reason": "選択理由"
          }
        ]
      }
    `;

		return {
			type: "ingredient_analysis_request",
			prompt: analysisPrompt,
			input_data: {
				ingredients,
				analysis: {
					ingredientCount: ingredients.length,
					complexity:
						ingredients.length > 5
							? "高"
							: ingredients.length > 3
								? "中"
								: "低",
				},
			},
			expected_format: "JSON",
			message: `${ingredients.length}個の食材の分析リクエストを準備しました`,
			instructions:
				"AIモデルに上記のプロンプトを送信し、JSON形式で食材分析を生成してください",
		};
	},
});
