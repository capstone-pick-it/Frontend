import React, { useState } from 'react'
import logo from '../../assets/images/logo.svg'
import AuthButton from '../../components/Auth/AuthButton'
import AuthField from '../../components/Auth/AuthField'
import { loginUser } from '../../api/auth'
import { saveAuthTokens } from '../../api/token'

const Login = ({ onSignupClick, onResetPasswordClick, onLoginSuccess }) => {
  const [form, setForm] = useState({
    email: '',
    password: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const updateForm = (field) => (event) => {
    setForm((prevForm) => ({
      ...prevForm,
      [field]: event.target.value,
    }))
    setErrorMessage('')
  }

  const isLoginReady = Boolean(form.email.trim() && form.password)

  const handleLogin = async (event) => {
    event.preventDefault()

    if (!form.email || !form.password) {
      setErrorMessage('이메일과 비밀번호를 입력해주세요.')
      return
    }

    try {
      setIsSubmitting(true)
      const response = await loginUser(form)

      saveAuthTokens(response.result)
      onLoginSuccess()
    } catch (error) {
      setErrorMessage(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="login">
      <section className="login__logo-area">
        <img className="login__logo" src={logo} alt="Pick-It" />
      </section>

      <form className="login__form" onSubmit={handleLogin}>
        <AuthField
          type="email"
          placeholder="학교 이메일주소"
          value={form.email}
          onChange={updateForm('email')}
        />
        <AuthField
          type="password"
          placeholder="비밀번호"
          value={form.password}
          onChange={updateForm('password')}
        />
        <button className="login__reset" type="button" onClick={onResetPasswordClick}>
          비밀번호가 기억나지 않으시나요?
        </button>
        <div className="login__button-area">
          {errorMessage && (
            <p className="auth-message login__message" aria-live="polite">
              {errorMessage}
            </p>
          )}
          <AuthButton type="submit" disabled={isSubmitting || !isLoginReady}>
            {isSubmitting ? '로그인 중...' : '로그인'}
          </AuthButton>
        </div>
      </form>

      <button className="login__signup" type="button" onClick={onSignupClick}>
        회원가입
      </button>
    </main>
  )
}

export default Login
