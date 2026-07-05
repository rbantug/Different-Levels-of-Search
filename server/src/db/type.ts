export interface RecipeSchema {
  id: string;
  recipeName: string;
  category: string;
  area: string;
  slug: string;
  recipeThumbnail: string;
  instructions: string[];
  ingredients: string[];
  embedding: number[];
  createdAt: Date;
  updatedAt: Date;
}
