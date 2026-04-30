import React from 'react'

const AuthField = ({ type = 'text', placeholder }) => {
  return <input className="auth-field" type={type} placeholder={placeholder} />
}

export default AuthField
