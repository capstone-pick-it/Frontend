import React from 'react'

const AuthStepHeader = ({ title, step, stepTitle, onBack }) => {
  return (
    <header className="auth-step-header">
      {onBack && (
        <button className="auth-step-header__back" type="button" aria-label="뒤로가기" onClick={onBack}>
          &lt;
        </button>
      )}
      <h1>{title}</h1>
      <div className="auth-step-header__bars">
        {[1, 2, 3].map((item) => (
          <span
            className={item <= step ? 'is-active' : ''}
            key={item}
          />
        ))}
      </div>
      <h2>{step}. {stepTitle}</h2>
    </header>
  )
}

export default AuthStepHeader
