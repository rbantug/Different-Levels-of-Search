import type { Root as JoiRoot } from "joi";
import slugify from "slugify";
import type { BuildKeywords } from "../utils/recipe/buildKeywords.js";

export interface UUID {
  makeId: () => string;
}

export interface RecipeDependencies {
  joi: JoiRoot;
  uuid: UUID;
  slugify: typeof slugify;
  buildKeywords: (param: BuildKeywords) => string[];
}

export interface ValidationDependencies {
  joi: JoiRoot;
}

export interface RecipeValidated {
  id: string;
  recipeName: string;
  category: string;
  area: string;
  slug: string;
  recipeThumbnail: string | null;
  instructions: string[];
  ingredients: string[];
  keywords: string[];
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
  keywords: string[];
}

export type UpdateRecipe = Partial<CreateRecipe>;
