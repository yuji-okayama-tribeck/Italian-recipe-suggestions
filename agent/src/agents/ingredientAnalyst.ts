import { openai } from "@ai-sdk/openai";
import { Agent } from "@voltagent/core";
import { VercelAIProvider } from "@voltagent/vercel-ai";
import { z } from "zod";
import { ingredientAnalysisTool } from "../tools";

/**
 * 食材分析
 */
export const IngredientAnalystAgent = new Agent({
	name: "ingredient-analyst-agent",
	instructions: `
    あなたはイタリア料理の食材分析の専門家です。
    与えられた食材を分析し、イタリア料理における使用法、相性の良い組み合わせ、推奨される追加食材などを提案してください。

    # JSONフォーマット
    {
        "ingredients": ["食材1", "食材2"],
        "analysis": {
            "食材1": {
                "usage": "イタリア料理での使用法",
                "pairings": ["相性の良い食材1", "相性の良い食材2"],
                "recommendedAdditions": ["推奨される追加食材1", "推奨される追加食材2"]
            },
            "食材2": {
                "usage": "イタリア料理での使用法",
                "pairings": ["相性の良い食材1", "相性の良い食材2"],
                "recommendedAdditions": ["推奨される追加食材1", "推奨される追加食材2"]
            }
        }
    }

    # 厳守事項
    - 評価は根拠を添えて、過度に曖昧な表現を避け、必ず上記のJSON構造でレスポンスしてください。
  `,
	parameters: z.object({
		ingredients: z.array(z.string()).describe("食材"),
	}),
	llm: new VercelAIProvider(),
	model: openai("gpt-4o-mini"),
	tools: [ingredientAnalysisTool],
});
