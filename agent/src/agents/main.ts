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

    **主な機能：**
    1. **食材分析データの受信と処理**
    2. **レシピ生成データの受信と処理**
    3. **バリエーションデータの受信と処理**（必要な場合）
    4. **全データの統合と構造化**
    5. **統合されたJSONレスポンスの生成**

    **処理フロー：**
    - ユーザーリクエストを解析
    - 各ステップからのJSONデータを収集
    - データの整合性を確認
    - 統合された構造化データを生成
    - レコメンデーションと次のステップを提案

    **出力形式：**
    統合されたJSONデータには以下が含まれます：
    - サマリー情報（リクエストID、タイムスタンプ、完了ステップ）
    - 食材分析結果
    - 生成されたレシピ
    - バリエーション情報（該当する場合）
    - レコメンデーション
    - メタデータ

    各ステップのデータを適切に統合し、一貫性のある包括的なレシピ情報を提供してください。
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
