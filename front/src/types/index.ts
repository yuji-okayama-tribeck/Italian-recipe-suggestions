// バリエーションタイプの定数定義（agentと同期）
export const RECIPE_VARIATIONS = [
	"vegetarian",
	"vegan", 
	"gluten-free",
	"spicy",
	"creamy",
	"light",
] as const;

export type RecipeVariationType = typeof RECIPE_VARIATIONS[number];

export const VARIATION_NAMES: Record<RecipeVariationType, string> = {
	vegetarian: "ベジタリアン",
	vegan: "ビーガン",
	"gluten-free": "グルテンフリー",
	spicy: "スパイシー",
	creamy: "クリーミー",
	light: "ライト",
};

export interface User {
  id: string
  email: string
  name?: string
  avatar_url?: string
  dietary_restrictions?: string[]
  cooking_level?: 'beginner' | 'intermediate' | 'advanced'
  created_at: string
  updated_at: string
}

export interface Recipe {
  id: string
  user_id: string
  title: string
  description?: string
  ingredients: Ingredient[]
  instructions: Instruction[]
  cooking_time?: number
  difficulty_level?: 'easy' | 'medium' | 'hard'
  cuisine_type: string
  image_url?: string
  is_favorite: boolean
  created_at: string
}

export interface Ingredient {
  name: string
  amount: string
  unit?: string
}

export interface Instruction {
  step: number
  description: string
}

// VoltAgentワークフローに対応した型定義
export interface RecipeRequest {
  ingredients: string[]
  preferences?: {
    difficulty?: 'easy' | 'medium' | 'hard'
    cookingTime?: number
    servings?: number
    dietaryRestrictions?: ('vegetarian' | 'vegan' | 'gluten-free')[]
  }
  includeVariations?: boolean
  requestedVariations?: ('vegetarian' | 'vegan' | 'gluten-free' | 'spicy' | 'creamy' | 'light')[]
}

// 新しいリクエスト形式
export type NewRecipeRequest = Array<
  | {
      type: "ingredients"
      items: string[]
    }
  | {
      type: "preferences"
      difficulty: 'easy' | 'medium' | 'hard'
      cookingTime: number
      servings: number
    }
  | {
      type: "variations"
      includeVariations: boolean
      requestedVariations: ('vegetarian' | 'vegan' | 'gluten-free' | 'spicy' | 'creamy' | 'light')[]
    }
>

export interface VoltAgentRecipe {
  recipeName: string
  description: string
  ingredients: {
    name: string
    amount: string
    unit: string
  }[]
  instructions: string[]
  cookingTime: number
  difficulty: string
  servings: number
  tips: string[]
  cuisine: string
  region?: string
  wine_pairing?: string
}

export interface RecipeVariation {
  variationName: string
  originalRecipe: string
  modificationType: string
  ingredients: {
    name: string
    amount: string
    unit: string
    substitution?: string
  }[]
  instructions: string[]
  substitutions: {
    original: string
    replacement: string
    reason: string
  }[]
  nutritionalBenefits?: string
  difficulty: string
  cookingTime: number
  cuisine: string
}

// 実際のAPIレスポンスに対応した新しい型
export interface APIVariationResponse {
  variationName: string
  originalRecipe: string
  modificationType: string
  ingredients: {
    name: string
    amount: string
    unit: string
    substitution?: string
  }[]
  instructions: string[]
  substitutions: {
    original: string
    replacement: string
    reason: string
  }[]
  nutritionalBenefits?: string
  difficulty: string
  cookingTime: number
  cuisine: string
}

export interface IngredientAnalysis {
  compatibility: string
  suggestedDishTypes: string[]
  recommendedAdditions: {
    ingredient: string
    reason: string
    priority: 'high' | 'medium' | 'low'
  }[]
  difficultyAssessment: string
  cookingMethods: string[]
  regionalSuggestions: {
    region: string
    dishName: string
    reason: string
  }[]
}

export interface RecipeResponse {
  mainRecipe: VoltAgentRecipe
  variations?: RecipeVariation[]
  ingredientAnalysis: IngredientAnalysis
  metadata: {
    generated_at: string
    language: string
    format: string
    workflow_version: string
    agent_used?: string
  }
}

export interface VoltAgentResponse {
  success: boolean
  data: {
    provider: {
      steps: {
        content: {
          type: string
          text?: string
          toolCallId?: string
          toolName?: string
          input?: any
          output?: any
          providerMetadata?: any
        }[]
        finishReason: string
        usage: {
          inputTokens: number
          outputTokens: number
          totalTokens: number
          reasoningTokens: number
          cachedInputTokens: number
        }
        warnings: any[]
        request: any
        response?: any
      }[]
    }
    text: string
    usage: {
      promptTokens: number
      completionTokens: number
      totalTokens: number
      cachedInputTokens: number
      reasoningTokens: number
    }
    toolCalls: any[]
    toolResults: any[]
    finishReason: string
    reasoning: string
    warnings: any[]
    userContext: any
  }
}
