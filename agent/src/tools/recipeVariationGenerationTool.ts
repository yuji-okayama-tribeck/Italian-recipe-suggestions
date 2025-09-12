import { createTool } from "@voltagent/core";
import { z } from "zod";

/**
 * レシピバリエーション生成ツール
 */
export const recipeVariationGenerationTool = createTool({
	name: "recipeVariationGenerationTool",
	description: "既存のイタリアンレシピのバリエーションを生成します。",
	parameters: z.object({
		baseRecipe: z.string().describe("ベースとなるレシピ"),
		variationTypeList: z.array(z.string()).describe("生成したいバリエーションのタイプ"),
	}),
	execute: async ({ baseRecipe, variationTypeList }) => {
		const arengeRecipe = `
		以下のベースレシピをもとに、指定されたバリエーションタイプごとに異なるイタリアンレシピを生成してください。
		各バリエーションタイプに対して1つずつ、合計${variationTypeList.length}個のレシピバリエーションを生成してください。

		ベースレシピ: ${baseRecipe}
		バリエーションタイプ: ${variationTypeList.join(", ")}

		# 出力フォーマット
		JSONオブジェクトの配列で返却してください：
		[
		  ${variationTypeList.map((variationType) => `{
		    "variationName": "バリエーション名",
		    "originalRecipe": "オリジナルレシピ名",
		    "modificationType": "${variationType}",
		    "ingredients": [{"name": "食材名", "amount": "分量", "unit": "日本語単位", "substitution": "代替理由（もしあれば）"}],
		    "instructions": ["変更された手順1", "変更された手順2"],
		    "substitutions": [{"original": "元の食材", "replacement": "代替食材", "reason": "理由"}],
		    "nutritionalBenefits": "栄養面での利点（該当する場合）",
		    "difficulty": "難易度",
		    "cookingTime": 調理時間(分),
		    "cuisine": "Italian",
		    "metadata": {
		      "baseRecipe": "${baseRecipe}",
		      "variationType": "${variationType}",
		      "generatedAt": "${new Date().toISOString()}",
		      "language": "ja",
		      "format": "JSON"
		    }
		  }`).join(',\n  ')}
		]

		# 厳守事項
		- 代替食材の根拠と、オリジナルからの差分を明確に示してください。
		- 各バリエーションタイプに特化した変更を行ってください。
		- 必ずJSONオブジェクトの配列形式で返却してください。
		- 各バリエーションは異なる特徴を持つようにしてください。
		`;

		return arengeRecipe;
	}
});
