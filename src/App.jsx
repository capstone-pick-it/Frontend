import React, { useEffect, useState } from 'react'
import Login from './pages/Login'
import PasswordReset from './pages/PasswordReset'
import Signup from './pages/Signup'
import Splash from './pages/Splash'

const App = () => {
  const [page, setPage] = useState('splash')

  useEffect(() => {
    if (page !== 'splash') {
      return undefined
    }

    const timer = window.setTimeout(() => {
      setPage('login')
    }, 900)

    return () => window.clearTimeout(timer)
  }, [page])

  const pages = {
    splash: <Splash />,
    login: (
      <Login
        onSignupClick={() => setPage('signup')}
        onResetPasswordClick={() => setPage('reset')}
      />
    ),
    signup: <Signup onLoginClick={() => setPage('login')} />,
    reset: <PasswordReset onLoginClick={() => setPage('login')} />,
  }

  return (
    <div className='container auth-container'>
      {pages[page] || pages.login}
    </div>
  )
}

export default App
