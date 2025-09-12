import { Agent } from "@voltagent/core";
import { VercelAIProvider } from "@voltagent/vercel-ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { recipeGenerationTool } from "../tools/recipe";

/**
 * レシピ生成
 */
export const recipeGenerationAgent = new Agent({
  name: "recipeGenerate",
  instructions: `
    あなたはイタリアンのレシピ生成に特化しています。
    与えられた条件から、本格的で家庭で再現可能なレシピをJSONで返します。
    単位は日本語表記に統一し、手順は具体的・簡潔にしてください。
  `,
  parameters: z.object({
    prompt: z.string().describe("ユーザーからの入力プロンプト"),
  }),
  llm: new VercelAIProvider(),
  model: openai("gpt-4o-mini"),
  tools: [recipeGenerationTool],
});
