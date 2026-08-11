import type { Root as JoiRoot } from "joi";

export interface UUID {
  makeId: () => string;
}

export interface RecipeDependencies {
  joi: JoiRoot;
  uuid: UUID;
}

export interface ValidationDependencies {
  joi: JoiRoot;
}

export interface RecipeValidated {
  recipeId: string;
  recipeName: string;
  category: string;
  area: string;
  slug: string;
  recipeThumbnail: string | null;
  instructions: string[];
  ingredients: string[];
  ingredientNames: string[];
  embedding: number[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateRecipe {
  recipeName: string;
  category: string;
  area: string;
  slug: string;
  recipeThumbnail: string | null;
  instructions: string[];
  ingredients: string[];
  ingredientNames: string[];
}

export type UpdateRecipe = Partial<CreateRecipe>;
