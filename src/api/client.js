import axios from 'axios'
import { getAccessToken } from './token'

const apiClient = axios.create({
  baseURL: '',
})

apiClient.interceptors.request.use((config) => {
  const { requireAuth = false, ...requestConfig } = config
  const accessToken = requireAuth ? getAccessToken() : null

  if (accessToken) {
    requestConfig.headers = requestConfig.headers || {}
    requestConfig.headers.Authorization = `Bearer ${accessToken}`
  }

  return requestConfig
})

export const request = async (path, options = {}) => {
  try {
    const response = await apiClient({
      url: path,
      ...options,
    })

    if (response.data?.isSuccess === false) {
      const error = new Error(response.data?.message || '요청 처리 중 오류가 발생했습니다.')
      error.status = response.status
      error.code = response.data?.code
      error.result = response.data?.result
      throw error
    }

    return response.data
  } catch (error) {
    const data = error.response?.data
    const requestError = new Error(data?.message || error.message || '요청 처리 중 오류가 발생했습니다.')
    requestError.status = error.response?.status
    requestError.code = data?.code
    requestError.result = data?.result
    throw requestError
  }
}
