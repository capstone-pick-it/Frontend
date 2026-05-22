import { getAccessToken } from './token'

const API_BASE_URL = import.meta.env.DEV ? '' : (import.meta.env.VITE_API_BASE_URL || '')

export const request = async (path, options = {}) => {
  const { auth = false, headers, ...fetchOptions } = options
  const accessToken = auth ? getAccessToken() : null

  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...headers,
    },
    credentials: 'include',
    ...fetchOptions,
  })

  const responseText = await response.text()
  const data = responseText
    ? (() => {
        try {
          return JSON.parse(responseText)
        } catch {
          return null
        }
      })()
    : null

  if (!response.ok || data?.isSuccess === false) {
    const error = new Error(data?.message || responseText || '요청 처리 중 오류가 발생했습니다.')
    error.status = response.status
    error.code = data?.code
    error.result = data?.result
    throw error
  }

  return data
}
