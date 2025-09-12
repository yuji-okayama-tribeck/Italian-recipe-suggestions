import { createTool } from "@voltagent/core";
import { z } from "zod";

/**
 * レシピバリエーション生成ツール
 */
export const recipeVariationGenerationTool = createTool({
	name: "recipeVariationGenerationTool",
	description: "既存のイタリアンレシピのバリエーションを生成する",
	parameters: z.object({
		baseRecipe: z.string().describe("ベースとなるレシピ名または説明"),
		variationType: z
			.enum(["vegetarian", "vegan", "gluten-free", "spicy", "creamy", "light"])
			.describe("作成するバリエーションの種類"),
		additionalIngredients: z
			.array(z.string())
			.optional()
			.describe("追加で組み込む食材"),
	}),
	execute: async ({
		baseRecipe,
		variationType,
		additionalIngredients = [],
	}) => {
		const variationTypeJa = {
			vegetarian: "ベジタリアン",
			vegan: "ビーガン",
			"gluten-free": "グルテンフリー",
			spicy: "スパイシー",
			creamy: "クリーミー",
			light: "ライト",
		}[variationType];

		const variationPrompt = `
      以下のイタリアンレシピの${variationTypeJa}バージョンを作成してください：${baseRecipe}

      ${additionalIngredients.length > 0 ? `追加で含める食材：${additionalIngredients.join("、")}` : ""}

      要件：
      - イタリア料理の本格性を維持する
      - オリジナルからの変更点を明確に説明する
      - バリエーションが${variationTypeJa}の要件を満たすことを確認する
      - 代替食材の説明を提供する

      重要：単位は必ず日本語で表記してください：
      - 大さじ (tbsp → 大さじ)
      - 小さじ (tsp → 小さじ)
      - カップ (cup → カップ)
      - グラム (g)
      - ミリリットル (ml)
      - リットル (L)
      - 個、本、枚、かけ、適量など

      英語の単位（tbsp、tsp、cup、oz、lb等）は使用せず、必ず日本語に変換してください。

      必須：レスポンスはJSON形式で以下の構造に従ってください：
      {
        "variationName": "バリエーション名",
        "originalRecipe": "オリジナルレシピ名",
        "modificationType": "${variationTypeJa}",
        "ingredients": [{"name": "食材名", "amount": "分量", "unit": "日本語単位", "substitution": "代替理由（もしあれば）"}],
        "instructions": ["変更された手順1", "変更された手順2", ...],
        "substitutions": [{"original": "元の食材", "replacement": "代替食材", "reason": "理由"}],
        "nutritionalBenefits": "栄養面での利点（該当する場合）",
        "difficulty": "難易度",
        "cookingTime": 調理時間（分）,
        "cuisine": "Italian"
      }
    `;

		return {
			type: "recipe_variation_request",
			prompt: variationPrompt,
			input_data: {
				baseRecipe,
				variationType,
				variationTypeJa,
				additionalIngredients,
			},
			expected_format: "JSON",
			message: `レシピバリエーションリクエストを準備しました：${baseRecipe}の${variationTypeJa}バージョン`,
			instructions:
				"AIモデルに上記のプロンプトを送信し、JSON形式でバリエーションレシピを生成してください",
		};
	},
});

/**
 * データ集約ツール
 */
export const dataAggregationTool = createTool({
	name: "dataAggregationTool",
	description:
		"各ステップのJSON形式のレスポンスを統合し、完全なレシピ情報をまとめる",
	parameters: z.object({
		ingredientAnalysis: z.any().optional().describe("食材分析のJSONレスポンス"),
		recipeGeneration: z.any().optional().describe("レシピ生成のJSONレスポンス"),
		recipeVariation: z.any().optional().describe("レシピバリエーションのJSONレスポンス"),
		userRequest: z.string().describe("元のユーザーリクエスト"),
	}),
	execute: async ({
		ingredientAnalysis,
		recipeGeneration,
		recipeVariation,
		userRequest,
	}) => {
		const aggregatedData = {
			summary: {
				requestId: `req_${Date.now()}`,
				timestamp: new Date().toISOString(),
				userRequest: userRequest,
				completedSteps: [] as string[],
				status: "completed",
			},
			ingredientAnalysis: ingredientAnalysis || null,
			recipeGeneration: recipeGeneration || null,
			recipeVariation: recipeVariation || null,
			recommendations: {
				nextSteps: [] as string[],
				alternativeOptions: [] as any[],
				cookingTips: [] as string[],
			},
			metadata: {
				workflowVersion: "2.0",
				aggregatedAt: new Date().toISOString(),
				language: "ja",
				format: "JSON",
			},
		};

		// 完了したステップを記録
		if (ingredientAnalysis) {
			aggregatedData.summary.completedSteps.push("ingredient_analysis");
		}
		if (recipeGeneration) {
			aggregatedData.summary.completedSteps.push("recipe_generation");
		}
		if (recipeVariation) {
			aggregatedData.summary.completedSteps.push("recipe_variation");
		}

		// レコメンデーションの生成
		if (ingredientAnalysis?.recommendedAdditions) {
			aggregatedData.recommendations.nextSteps.push("追加食材の検討");
		}
		if (recipeGeneration?.mainRecipe?.tips) {
			aggregatedData.recommendations.cookingTips =
				recipeGeneration.mainRecipe.tips;
		}
		if (recipeVariation && recipeGeneration) {
			aggregatedData.recommendations.alternativeOptions.push({
				type: recipeVariation.modificationType,
				description: `${recipeGeneration.mainRecipe?.recipeName}の${recipeVariation.modificationType}バージョン`,
			});
		}

		return {
			type: "data_aggregation_complete",
			aggregatedData,
			message: `${aggregatedData.summary.completedSteps.length}つのステップのデータを正常に統合しました`,
			recommendations: aggregatedData.recommendations,
			instructions:
				"統合されたデータをフロントエンドアプリケーションで表示するか、さらなる処理に使用してください",
		};
	},
});;
