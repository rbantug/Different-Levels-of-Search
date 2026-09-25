import axios from 'axios'
import type { Recipe } from '@/types/recipe'
import type { Suggestion } from '@/types/suggestions'
import config from '@/config'

export interface AxiosResponse<T> {
  count: number
  data: T[]
  status: string
  query: string
}

const api = axios.create({
  baseURL: `${config.apiUrl}/api/search`,
  timeout: 10000,
})

export async function keywordSearch(query: string): Promise<AxiosResponse<Recipe>> {
  const { data } = await api.get('/', {
    params: {
      q: query,
      limit: 100,
    },
  })

  return data
}

export async function hybridSearch(query: string): Promise<AxiosResponse<Recipe>> {
  const { data } = await api.get('/hybrid', {
    params: {
      q: query,
      limit: 100
    },
  })

  return data
}

export async function suggestion(query: string): Promise<AxiosResponse<Suggestion>> {
  const { data } = await api.get('/suggestion', {
    params: {
      q: query,
    },
  })

  return data
}