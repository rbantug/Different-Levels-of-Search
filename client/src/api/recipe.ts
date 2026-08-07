import axios from 'axios'
import type { Recipe } from '@/types/recipe'

export interface AxiosResponse<T> {
  count: number
  data: T
  status: string
  query: string
}

const api = axios.create({
  baseURL: 'http://localhost:3000/api/recipes',
  timeout: 10000,
})

export async function getSingleRecipe(recipeId: string): Promise<AxiosResponse<Recipe>> {
  const { data } = await api.get(`/${recipeId}`)

  return data
}