export const createSignupRequestBody = ({ email, password, nickname }) => ({
  email,
  password,
  nickname,
})

export const createLoginRequestBody = ({ email, password }) => ({
  email,
  password,
})

export const createTokenRefreshRequestBody = ({ refreshToken }) => ({
  refreshToken,
})

export const createEmailSendRequestBody = ({ email }) => ({
  email,
})

export const createEmailVerifyRequestBody = ({ email, code }) => ({
  email,
  code,
})
