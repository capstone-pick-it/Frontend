const DEFAULT_TIMEOUT = 10000

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

const createUrl = (path) => {
  if (/^https?:\/\//.test(path)) {
    return path
  }

  return `${API_BASE_URL}${path}`
}

const request = async (path, options = {}) => {
  const controller = new AbortController()
  const timeoutId = window.setTimeout(() => controller.abort(), options.timeout || DEFAULT_TIMEOUT)

  try {
    const response = await fetch(createUrl(path), {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
      signal: controller.signal,
      body: options.body ? JSON.stringify(options.body) : undefined,
    })

    const contentType = response.headers.get('content-type')
    const data = contentType?.includes('application/json') ? await response.json() : await response.text()

    if (!response.ok) {
      throw new Error(data?.message || 'API 요청에 실패했습니다.')
    }

    return data
  } finally {
    window.clearTimeout(timeoutId)
  }
}

export const apiClient = {
  get: (path, options) => request(path, { ...options, method: 'GET' }),
  post: (path, body, options) => request(path, { ...options, method: 'POST', body }),
  patch: (path, body, options) => request(path, { ...options, method: 'PATCH', body }),
  delete: (path, options) => request(path, { ...options, method: 'DELETE' }),
}
