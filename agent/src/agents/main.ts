import { openai } from "@ai-sdk/openai";
import { Agent } from "@voltagent/core";
import { VercelAIProvider } from "@voltagent/vercel-ai";

import { z } from "zod";

import { IngredientAnalystAgent } from "./ingredientAnalyst";
import { RecipeGenerationAgent } from "./recipeGeneration";
import { RecipeVariationGenerationAgent } from "./recipeVariationGeneration";

/**
 * Buonoくん
 */
export const BuonoKun = new Agent({
  name: "buono-kun",
  instructions: `
    あなたはイタリア料理レシピ提案の統合エージェントです。
    以下の手順に従って、イタリアンおレシピ情報を提供します。

    # 手順
    1.IngredientAnalystAgentを使用して食材分析を行います。
    2.RecipeGenerationAgentを使用してレシピ生成を行います。
    3.RecipeVariationGenerationAgentを使用してレシピのバリエーションを生成します（必要に応じて）。
    4.最終的に、各ステップで生成されたJSONデータを統合し、ユーザーに提供します。

    # JSONフォーマット
    {
      "ingredientAnalysis": { ... }, // IngredientAnalystAgentからのレスポンス
      "mainRecipe": { ... }, // RecipeGenerationAgentからのレスポンス
      "variations": [ ... ], // RecipeVariationGenerationAgentからのレスポンス（もしあれば）
      "metadata": {
        "generatedAt": "生成日時",
      }
    }

    # 厳守事項
    - サブエージェントやツールを呼び出す際にも、確認や同意のプロンプトは一切表示せず、ユーザーの追加アクションを求めないでください。
  `,
  parameters: z.object({
    prompt: z.string().describe("食材、難易度、人数、バリエーションを含む自然文入力"),
  }),
  llm: new VercelAIProvider(),
  model: openai("gpt-4o-mini"),
  subAgents: [IngredientAnalystAgent, RecipeGenerationAgent, RecipeVariationGenerationAgent],
});
