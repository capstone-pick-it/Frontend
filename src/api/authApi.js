import { apiClient } from './httpClient'

export const authApi = {
  login: ({ email, password }) => apiClient.post('/auth/login', { email, password }),
  signup: (payload) => apiClient.post('/auth/signup', payload),
  sendVerificationCode: ({ email }) => apiClient.post('/auth/email/code', { email }),
  verifyCode: ({ email, code }) => apiClient.post('/auth/email/verify', { email, code }),
  resetPassword: (payload) => apiClient.post('/auth/password/reset', payload),
}
