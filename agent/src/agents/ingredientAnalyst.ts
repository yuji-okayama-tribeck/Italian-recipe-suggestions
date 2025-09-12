import { Agent } from "@voltagent/core";
import { VercelAIProvider } from "@voltagent/vercel-ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { ingredientAnalysisTool } from "../tools";

/**
 * 食材分析
 */
export const ingredientAnalystAgent = new Agent({
  name: "ingredientAnalyst",
  instructions: `
    あなたはイタリア料理の食材分析に特化しています。
    食材の相性、地方性、提案カテゴリをJSONで返します。
    評価は根拠を添えて、過度に曖昧な表現を避けてください。
  `,
  parameters: z.object({
    ingredients: z.array(z.string()).describe("分析する食材"),
  }),
  llm: new VercelAIProvider(),
  model: openai("gpt-4o-mini"),
  tools: [ingredientAnalysisTool],
});
