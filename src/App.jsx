import React from 'react'
import Login from './pages/Login'
import Signup from './pages/Signup'

const App = () => {
  const [page, setPage] = React.useState('login')

  const pages = {
    login: (
      <Login
        onSignupClick={() => setPage('signup')}
        onResetPasswordClick={() => setPage('reset')}
      />
    ),
    signup: <Signup onLoginClick={() => setPage('login')} />,
  }

  return (
    <div className='container auth-container'>
      {pages[page] || pages.login}
    </div>
  )
}

export default App
