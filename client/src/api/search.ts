import axios from 'axios'
import type { Recipe } from '@/types/recipe';

export interface AxiosResponse {
    count: number;
    data: Recipe[];
    status: string;
    query: string;
}

const api = axios.create({
  baseURL: 'http://localhost:3000/api/search',
})

export async function keywordSearch(query: string):Promise<AxiosResponse> {
  const { data } = await api.get('/', {
    params: {
      q: query,
    },
  })

  return data
}

export async function hybridSearch(query: string):Promise<AxiosResponse> {
  const { data } = await api.get('/hybrid', {
    params: {
      q: query,
    },
  })

  return data
}