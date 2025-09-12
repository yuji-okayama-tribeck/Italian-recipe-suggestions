import { Agent } from "@voltagent/core";
import { VercelAIProvider } from "@voltagent/vercel-ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";

import { ingredientAnalystAgent } from "./ingredientAnalyst";
import { recipeGenerationAgent } from "./recipeGeneration";
import { recipeVariationAgent } from "./recipeVariation";

/**
 * Buonoくん
 */
export const BuonoKun = new Agent({
  name: "buono-kun",
  instructions: `
    ユーザーのリクエストを理解し、必ず次の順序で対応してください：

    **Step 1: 食材分析 
    - ユーザーが提示した食材、またはプロンプトから抽出した食材を分析
    - 食材のイタリア料理への適性、相性、地方ごとの使用法を評価
    - 分析結果を元に推奨する料理のカテゴリーを特定

    **Step 2: レシピ生成
    - Step 1の分析結果とユーザーの条件を組み合わせ
    - 詳細なイタリアンレシピを作成
    - 分析で得られた食材の特性を活かしたレシピ提案

    **Step 3: バリエーション生成（必要な場合のみ）**
    - ユーザーがバリエーション（ベジタリアン、ビーガン、グルテンフリー等）を求めている場合
    - Step 2で生成したレシピをベースにアレンジレシピを作成
    - 指定されたスタイルや条件に合わせた代替案を提供

    各ステップのレスポンスは必ずJSON形式でまとめてください。
    例:
  `,
  parameters: z.object({
    prompt: z.string().describe("ユーザーからの入力プロンプト"),
  }),
  llm: new VercelAIProvider(),
  model: openai("gpt-4o-mini"),
  subAgents: [ingredientAnalystAgent, recipeGenerationAgent, recipeVariationAgent]
});
