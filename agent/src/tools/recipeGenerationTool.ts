import { createTool } from "@voltagent/core";
import { z } from "zod";

/**
 * レシピ生成ツール
 */
export const recipeGenerationTool = createTool({
  name: "recipeGenerationTool",
  description: "提供されたプロンプトからイタリアンレシピを生成する",
  parameters: z.object({
    prompt: z.string().describe("ユーザーからの入力プロンプト"),
  }),
  execute: async ({ prompt }) => {
    const recipePrompt = `
      ${prompt}

      以下の条件でイタリアンレシピを生成してください：
      - 本格的なイタリア料理であること
      - 正確な分量を含めること
      - ステップバイステップの手順を提供すること
      - 調理のコツを含めること

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
        "mainRecipe": {
          "recipeName": "レシピ名",
          "description": "料理の説明",
          "ingredients": [{"name": "食材名", "amount": "分量", "unit": "日本語単位"}],
          "instructions": ["手順1", "手順2", ...],
          "cookingTime": 調理時間（分）,
          "difficulty": "難易度",
          "servings": 人数分,
          "tips": ["調理のコツ1", "調理のコツ2", ...],
          "cuisine": "Italian",
          "region": "イタリアの地方（もしあれば）",
          "wine_pairing": "おすすめワイン"
        },
        "variations": [
          {
            "variationName": "バリエーション名",
            "modificationType": "バリエーションタイプ",
            "ingredients": [{"name": "食材名", "amount": "分量", "unit": "日本語単位", "substitution": false}],
            "instructions": ["手順1", "手順2", ...],
            "substitutions": [{"original": "元の食材", "replacement": "代替食材", "reason": "理由"}],
            "nutritionalBenefits": "栄養面での利点",
            "difficulty": "難易度",
            "cookingTime": 調理時間（分）,
            "cuisine": "Italian"
          }
        ],
        "ingredientAnalysis": {
          "compatibility": "相性評価",
          "suggestedDishTypes": ["料理タイプ1", "料理タイプ2"],
          "recommendedAdditions": [
            {
              "ingredient": "推奨食材",
              "reason": "推奨理由",
              "priority": "high/medium/low"
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
        },
        "metadata": {
          "generated_at": "生成日時",
          "language": "ja",
          "format": "JSON",
          "workflow_version": "1.0"
        }
      }
    `;

    return {
      type: "recipe_generation_request",
      prompt: recipePrompt,
      input_data: {
        user_prompt: prompt,
      },
      expected_format: "JSON",
      message: `ユーザーのプロンプトに基づいたレシピ生成リクエストを準備しました`,
      instructions:
        "AIモデルに上記のプロンプトを送信し、JSON形式でレシピを生成してください",
    };
  },
});

