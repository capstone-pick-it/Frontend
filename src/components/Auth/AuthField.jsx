import React from 'react'

const AuthField = ({ type = 'text', placeholder, ...props }) => {
  return <input className="auth-field" type={type} placeholder={placeholder} {...props} />
}

export default AuthField
