export interface RecipeSearchDocument {
  id: string;
  recipeName: string;
  category: string;
  area: string;
  ingredients: string[];
}

export interface KeywordSearchDocument {
  id: string;
  keyword: string;
}
