import { openai } from "@ai-sdk/openai";

import { VoltAgent, Agent, Memory } from "@voltagent/core";
import { LibSQLMemoryAdapter } from "@voltagent/libsql";

import { z } from "zod";

import { RecipeGenerationAgent } from "./recipeGeneration";
import { RecipeVariationGenerationAgent } from "./recipeVariationGeneration";

const memory = new Memory({
  storage: new LibSQLMemoryAdapter({ url: "file:./.voltagent/memory.db" }),
});

/**
 * Buonoくん
 */
export const BuonoKun = new Agent({
  name: "buono-kun",
  instructions: `
    あなたはイタリア料理レシピ提案の統合エージェントです。
    以下の手順に従って、イタリアンレシピ情報を提供します。

    # 手順
    1. RecipeGenerationAgentを使用してメインレシピを生成します。
    2. RecipeVariationGenerationAgentを使用してレシピのバリエーションを生成します（必要に応じて）。
    3. 最終的に、各エージェントから返されたデータを以下のJSONフォーマットに統合してユーザーに提供します。

    # 最終出力JSONフォーマット（必須）
    {
      "mainRecipe": RecipeGenerationAgentから生成されたレシピのJSONオブジェクト,
      "variations": RecipeVariationGenerationAgentから生成されたバリエーションのJSONオブジェクト配列,
      "metadata": {
        "generatedAt": "${new Date().toISOString()}",
        "totalRecipes": バリエーションを含む総レシピ数,
        "language": "ja"
      }
    }

    # 統合処理の詳細指示
    - RecipeGenerationAgentの結果をそのまま"mainRecipe"フィールドに配置
    - RecipeVariationGenerationAgentの結果配列をそのまま"variations"フィールドに配置
    - バリエーションが生成されない場合は"variations"を空配列[]に設定
    - metadataには現在日時と統計情報を含める

    # 厳守事項
    - サブエージェントやツールを呼び出す際に、確認や同意のプロンプトは一切表示しない
    - 最終的に上記JSONフォーマットでのみレスポンスを返却する
    - 余計な説明文は一切含めない
    - JSONの外側にテキストを含めない
  `,
  // parameters: z.object({
  //   prompt: z.string().describe("食材、難易度、人数、バリエーションの要求を含む自然文入力。例: 'トマトとバジルでパスタを作りたいです。初心者向けで2人分、ヘルシーなバリエーションも教えてください'"),
  // }),
  memory,
  model: openai("gpt-4o-mini"),
  subAgents: [RecipeGenerationAgent, RecipeVariationGenerationAgent],
});
