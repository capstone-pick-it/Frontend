import axios from 'axios'
import { getAccessToken } from './token'

const apiClient = axios.create({
  baseURL: import.meta.env.DEV ? '' : (import.meta.env.VITE_API_BASE_URL || ''),
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

apiClient.interceptors.request.use((config) => {
  if (config.requiresAuth) {
    const token = getAccessToken()
    console.log('[Auth] requiresAuth:', config.requiresAuth, '| token:', token ? '있음' : '없음')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const data = error.response?.data
    console.log('[Error] status:', error.response?.status, '| data:', data)
    const err = new Error(data?.message || '요청 처리 중 오류가 발생했습니다.')
    err.status = error.response?.status
    err.code = data?.code
    err.result = data?.result
    return Promise.reject(err)
  }
)

export const request = (path, options = {}) => {
  const { auth = false, body, method = 'GET', headers } = options
  return apiClient({
    url: path,
    method,
    data: body ? JSON.parse(body) : undefined,
    headers,
    requiresAuth: auth,
  })
}
