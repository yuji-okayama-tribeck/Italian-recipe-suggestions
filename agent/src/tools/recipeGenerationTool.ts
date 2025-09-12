import { createTool } from "@voltagent/core";
import { z } from "zod";

/**
 * レシピ生成ツール
 */
export const recipeGenerationTool = createTool({
  name: "recipeGenerationTool",
  description: "本格的で家庭で再現可能なイタリアンレシピを生成します。",
  parameters: z.object({
    ingredients: z.array(z.string()).describe("食材"),
  }),
  execute: async ({ ingredients }) => {
    const baseRecipe = `
    以下の食材を使用して、本格的で家庭で再現可能なイタリアンレシピを作成してください。
    食材: ${ingredients.join(", ")}

    # JSONフォーマット
    {
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
    }

    # 厳守事項
    - 単位は日本語表記に統一（大さじ、小さじ、カップ、g、ml等）し、手順は具体的・簡潔にしてください。
    `;

    return baseRecipe;
  },
});
