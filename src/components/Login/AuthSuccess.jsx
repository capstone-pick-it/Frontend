import React from 'react'
import logo from '../../assets/images/logo.png'
import AuthButton from './AuthButton'

const AuthSuccess = ({ email, message, buttonText, onButtonClick }) => {
  return (
    <main className="auth-success">
      <div className="auth-success__text">
        <h1>{email} 님</h1>
        <h1>{message}</h1>
        <p>피켓에서 좋은 팀원들을 만나길 바랍니다!</p>
      </div>

      <img className="auth-success__logo" src={logo} alt="Pick-It" />

      <div className="auth-success__button">
        <AuthButton onClick={onButtonClick}>{buttonText}</AuthButton>
      </div>
    </main>
  )
}

export default AuthSuccess
