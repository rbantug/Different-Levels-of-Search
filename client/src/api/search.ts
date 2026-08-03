import axios from 'axios'
import type { Recipe } from '@/types/recipe'
import type { Suggestion } from '@/types/suggestions'

export interface AxiosResponse<T> {
  count: number
  data: T[]
  status: string
  query: string
}

const api = axios.create({
  baseURL: 'http://localhost:3000/api/search',
  timeout: 10000,
  
})

export async function keywordSearch(query: string): Promise<AxiosResponse<Recipe>> {
  const { data } = await api.get('/', {
    params: {
      q: query,
    },
  })

  return data
}

export async function hybridSearch(query: string): Promise<AxiosResponse<Recipe>> {
  const { data } = await api.get('/hybrid', {
    params: {
      q: query,
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