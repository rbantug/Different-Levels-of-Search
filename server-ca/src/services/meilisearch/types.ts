export interface RecipeSearchDocument {
  id: string;
  recipeName: string;
  category: string;
  area: string;
  ingredients: string[];
  embedding: number[];
}

export interface KeywordSearchDocument {
  id: string;
  keyword: string;
}
