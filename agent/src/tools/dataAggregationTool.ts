import { createTool } from "@voltagent/core";
import { z } from "zod";

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
		recipeVariation: z
			.any()
			.optional()
			.describe("レシピバリエーションのJSONレスポンス"),
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
				alternativeOptions: [] as Array<{ type: string; description: string }>,
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
});
