import axios from 'axios'
import { getAccessToken } from './token'

const apiClient = axios.create({
  baseURL: import.meta.env.DEV ? '' : import.meta.env.VITE_API_BASE_URL || '',
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  const needsAuth = config.requireAuth || config.requiresAuth || config.auth
  const accessToken = needsAuth ? getAccessToken() : null

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  return config
})

apiClient.interceptors.response.use(
  (response) => {
    if (response.data?.isSuccess === false) {
      const error = new Error(response.data?.message || '요청 처리 중 오류가 발생했습니다.')
      error.status = response.status
      error.code = response.data?.code
      error.result = response.data?.result
      throw error
    }

    return response.data
  },
  (error) => {
    const data = error.response?.data
    const requestError = new Error(data?.message || error.message || '요청 처리 중 오류가 발생했습니다.')

    requestError.status = error.response?.status
    requestError.code = data?.code
    requestError.result = data?.result

    return Promise.reject(requestError)
  }
)

export const request = (path, options = {}) => {
  const {
    auth = false,
    requireAuth = false,
    requiresAuth = false,
    body,
    data,
    method = 'GET',
    headers,
    ...restOptions
  } = options

  return apiClient({
    url: path,
    method,
    data: data ?? (body ? JSON.parse(body) : undefined),
    headers,
    requireAuth: auth || requireAuth || requiresAuth,
    ...restOptions,
  })
}
