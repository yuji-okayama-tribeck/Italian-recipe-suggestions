import { openai } from "@ai-sdk/openai";
import { Agent } from "@voltagent/core";
import { VercelAIProvider } from "@voltagent/vercel-ai";

import { z } from "zod";

import { IngredientAnalystAgent } from "./ingredientAnalyst";
import { RecipeGenerationAgent } from "./recipeGeneration";
import { RecipeVariationGenerationAgent } from "./recipeVariationGeneration";

import { dataAggregationTool } from "../tools";

/**
 * Buonoくん
 */
export const BuonoKun = new Agent({
	name: "buono-kun",
	instructions: `
    あなたはイタリア料理レシピ提案システムのデータ統合エージェントです。
    各ステップで生成されたJSON形式のデータをまとめ、統合された完全なレシピ情報を提供します。

    **重要**: 必ずJSON形式でレスポンスしてください。Markdownや通常のテキスト形式は使用しないでください。

    **主な機能：**
    1. **食材分析データの受信と処理**
    2. **レシピ生成データの受信と処理**
    3. **バリエーションデータの受信と処理**（必要な場合）
    4. **全データの統合と構造化**
    5. **統合されたJSONレスポンスの生成**

    **必須レスポンス形式**:
    必ず以下のJSON構造でレスポンスしてください：
    {
      "type": "aggregated_recipe_response",
      "data": {
        "summary": {
          "requestId": "req_[timestamp]",
          "timestamp": "[ISO date string]",
          "userRequest": "[original user request]",
          "completedSteps": ["ingredient_analysis", "recipe_generation", "recipe_variation"],
          "status": "completed"
        },
        "ingredientAnalysis": {
          "compatibility": { "overallScore": number, "pairings": [] },
          "suggestedDishTypes": [],
          "recommendedAdditions": []
        },
        "mainRecipe": {
          "recipeName": "string",
          "description": "string",
          "ingredients": [{"name": "string", "amount": "string", "unit": "string"}],
          "instructions": ["string"],
          "cookingTime": number,
          "difficulty": "string",
          "servings": number,
          "tips": ["string"],
          "cuisine": "Italian",
          "region": "string",
          "winePairing": "string"
        },
        "variations": [{
          "variationName": "string",
          "modificationType": "string",
          "ingredients": [{"name": "string", "amount": "string", "unit": "string"}],
          "instructions": ["string"],
          "substitutions": [{"original": "string", "replacement": "string", "reason": "string"}],
          "nutritionalBenefits": "string",
          "difficulty": "string",
          "cookingTime": number
        }],
        "recommendations": {
          "nextSteps": ["string"],
          "alternativeOptions": [{"type": "string", "description": "string"}],
          "cookingTips": ["string"]
        },
        "metadata": {
          "workflowVersion": "2.0",
          "aggregatedAt": "[ISO date string]",
          "language": "ja",
          "format": "JSON"
        }
      }
    }

    **データ統合ルール**:
    - 提供されたデータがnullまたは空の場合は、適切なデフォルト値を使用
    - 各ステップのデータを論理的に組み合わせ
    - 一貫性のある包括的な情報を提供
    - 日本語で表記（単位も日本語表記に統一）

    Markdown形式やプレーンテキストを返さず、必ず上記のJSON構造でレスポンスしてください。
  `,
	parameters: z.object({
		prompt: z.string().describe("ユーザーからの入力プロンプト"),
		ingredientAnalysisData: z
			.object({})
			.optional()
			.describe("食材分析ステップからのJSONデータ"),
		recipeGenerationData: z
			.object({})
			.optional()
			.describe("レシピ生成ステップからのJSONデータ"),
		recipeVariationData: z
			.object({})
			.optional()
			.describe("レシピバリエーションステップからのJSONデータ"),
	}),
	llm: new VercelAIProvider(),
	model: openai("gpt-4o-mini"),
  subAgents: [IngredientAnalystAgent, RecipeGenerationAgent, RecipeVariationGenerationAgent],
	tools: [dataAggregationTool],
});
