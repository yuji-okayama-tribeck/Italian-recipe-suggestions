import { openai } from "@ai-sdk/openai";
import { Agent } from "@voltagent/core";
import { z } from "zod";
import { recipeGenerationTool } from "../tools";

/**
 * レシピ生成
 */
export const RecipeGenerationAgent = new Agent({
  name: "recipe-generation-agent",
  instructions: `
    あなたはイタリアンのレシピ生成に特化したエージェントです。
    食材から、本格的で家庭で再現可能なレシピを作成してください。

    # 出力形式
    - 必ずJSONオブジェクト形式で出力してください
    - 統合エージェントが処理しやすいよう、純粋なJSONのみを返してください
    - 説明文やコメントは含めないでください
  `,
  // parameters: z.object({
  //   ingredients: z.array(z.string()).describe("食材"),
  // }),
  model: openai("gpt-4o-mini"),
  tools: [recipeGenerationTool],
});
