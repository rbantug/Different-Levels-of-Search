export interface Recipe {
  id: string
  recipeName: string
  category: string
  area: string
  slug: string
  recipeThumbnail: string
  instructions: string[]
  ingredients: string[]
  finalScore: number
}