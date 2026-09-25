import axios from 'axios'
import type { Recipe } from '@/types/recipe'
import config from '@/config'

export interface AxiosResponse<T> {
  count: number
  data: T
  status: string
  query: string
}

const api = axios.create({
  baseURL: `${config.apiUrl}/api/recipes`,
  timeout: 10000,
})

export async function getSingleRecipe(recipeId: string): Promise<AxiosResponse<Recipe>> {
  const { data } = await api.get(`/${recipeId}`)

  return data
}