import { request } from './client'
import { getRefreshToken } from './token'
import {
  createEmailSendRequestBody,
  createEmailVerifyRequestBody,
  createLoginRequestBody,
  createSignupRequestBody,
  createTokenRefreshRequestBody,
} from './auth.dto'

export const signupUser = ({ email, password, nickname }) => {
  return request('/api/users/signup', {
    method: 'POST',
    body: JSON.stringify(createSignupRequestBody({ email, password, nickname })),
  })
}

export const loginUser = ({ email, password }) => {
  return request('/api/users/login', {
    method: 'POST',
    body: JSON.stringify(createLoginRequestBody({ email, password })),
  })
}

export const refreshToken = (refreshToken = getRefreshToken()) => {
  return request('/api/users/refresh', {
    method: 'POST',
    body: JSON.stringify(createTokenRefreshRequestBody({ refreshToken })),
  })
}

export const logoutUser = () => {
  return request('/api/users/logout', {
    method: 'POST',
    auth: true,
  })
}

export const deleteUser = () => {
  return request('/api/users/delete', {
    method: 'DELETE',
    auth: true,
  })
}

export const sendSignupEmailCode = ({ email }) => {
  return request('/api/users/email/send', {
    method: 'POST',
    body: JSON.stringify(createEmailSendRequestBody({ email })),
  })
}

export const verifySignupEmailCode = ({ email, code }) => {
  return request('/api/users/email/verify', {
    method: 'POST',
    body: JSON.stringify(createEmailVerifyRequestBody({ email, code })),
  })
}

export const getOnboardingStatus = () => {
  return request('/api/users/onboarding/status', {
    method: 'GET',
    auth: true,
  })
}

export const saveOnboardingProfile = ({ school, major, grade, semester, courses }) => {
  return request('/api/users/onboarding/profile',{
    method: 'POST',
    auth: true,
     body: JSON.stringify({ school, major, grade, semester, courses }),
  })
}

export const saveOnboardingPersonality = (traits) => {
  return request('/api/users/onboarding/personality',{
    method: 'POST',
    auth: true,
    body: JSON.stringify({ traits }),
  })
}