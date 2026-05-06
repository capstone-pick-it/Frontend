import React from 'react'

const AuthButton = ({ children, disabled = false, type = 'button', onClick }) => {
  return (
    <button className="auth-button" type={type} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  )
}

export default AuthButton
