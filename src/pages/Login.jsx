import React from 'react'
import logo from '../assets/images/logo.png'
import AuthButton from '../components/auth/AuthButton'
import AuthField from '../components/auth/AuthField'

const Login = ({ onSignupClick, onResetPasswordClick }) => {
  return (
    <main className="login">
      <section className="login__logo-area">
        <img className="login__logo" src={logo} alt="Pick-It" />
      </section>

      <form className="login__form">
        <AuthField type="email" placeholder="학교 이메일주소" />
        <AuthField type="password" placeholder="비밀번호" />
        <button className="login__reset" type="button" onClick={onResetPasswordClick}>
          비밀번호가 기억나지 않으시나요?
        </button>
        <AuthButton type="submit">로그인</AuthButton>
      </form>

      <button className="login__signup" type="button" onClick={onSignupClick}>
        회원가입
      </button>
    </main>
  )
}

export default Login
