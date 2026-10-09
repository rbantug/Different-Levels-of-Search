import axios from 'axios'
import config from '@/config'

export interface AxiosResponse {
  status: string
}

const api = axios.create({
  baseURL: `${config.apiUrl}/api`,
  timeout: 10000,
})

export default async function apiHealthCheck(): Promise<AxiosResponse> {
  const { data } = await api.get(`/health`)

  return data
}