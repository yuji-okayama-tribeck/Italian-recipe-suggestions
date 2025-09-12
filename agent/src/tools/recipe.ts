import { createTool } from "@voltagent/core";
import { z } from "zod";

export const recipeGenerationTool = createTool({
  name: "recipeGenerationTool",
  description: "提供されたプロンプトからイタリアンレシピを生成する",
  parameters: z.object({
    prompt: z.string().describe("ユーザーからの入力プロンプト"),
  }),
  execute: async ({ prompt }) => {
    // ユーザーのプロンプトを解析してレシピ生成
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

    // 構造化されたレスポンスを返す
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

/**
 * レシピバリエーション生成ツール
 */
export const recipeVariationTool = createTool({
  name: "recipeVariationTool",
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
