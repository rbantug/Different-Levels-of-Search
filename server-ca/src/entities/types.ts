import type { Root as JoiRoot } from "joi";

export interface UUID {
  makeId: () => string;
}

type Slugify = (
  string: string,
  options?: {
    lower?: boolean;
  },
) => string;

export interface RecipeDependencies {
  joi: JoiRoot;
  uuid: UUID;
  slugify: Slugify;
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
  recipeThumbnail: string | null;
  instructions: string[];
  ingredients: string[];
  keywords: string[];
}

export type UpdateRecipe = Partial<CreateRecipe>;
