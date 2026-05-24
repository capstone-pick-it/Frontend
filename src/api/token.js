const ACCESS_TOKEN_KEY = 'pickitAccessToken'
const REFRESH_TOKEN_KEY = 'pickitRefreshToken'
const USER_KEY = 'pickitUser'

export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY)

export const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY)

export const saveAuthTokens = ({ accessToken, refreshToken, userId, nickname }) => {
  if (accessToken) {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
  }

  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
  }

  if (userId || nickname) {
    localStorage.setItem(USER_KEY, JSON.stringify({ userId, nickname }))
  }
}

export const getUser = () => {
  const raw = localStorage.getItem(USER_KEY)
  return raw ? JSON.parse(raw) : null
}

export const clearAuthTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}
