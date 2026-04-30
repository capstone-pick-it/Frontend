import React, { useEffect } from 'react'
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom'

import './assets/sass/style.scss'
import Login from './pages/Login'
import PasswordReset from './pages/PasswordReset'
import Signup from './pages/Signup'
import Splash from './pages/Splash'
import Chat from './pages/Chat'
import ChatRoom from './pages/ChatRoom'
import MyPage from './pages/MyPage'

const AuthLayout = ({ children }) => {
  return <div className="container auth-container">{children}</div>
}

const SplashRoute = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const timer = window.setTimeout(() => {
      navigate('/login')
    }, 900)

    return () => window.clearTimeout(timer)
  }, [navigate])

  return (
    <AuthLayout>
      <Splash />
    </AuthLayout>
  )
}

const LoginRoute = () => {
  const navigate = useNavigate()

  return (
    <AuthLayout>
      <Login
        onSignupClick={() => navigate('/signup')}
        onResetPasswordClick={() => navigate('/reset-password')}
      />
    </AuthLayout>
  )
}

const SignupRoute = () => {
  const navigate = useNavigate()

  return (
    <AuthLayout>
      <Signup onLoginClick={() => navigate('/login')} />
    </AuthLayout>
  )
}

const PasswordResetRoute = () => {
  const navigate = useNavigate()

  return (
    <AuthLayout>
      <PasswordReset onLoginClick={() => navigate('/login')} />
    </AuthLayout>
  )
}

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SplashRoute />} />
        <Route path="/login" element={<LoginRoute />} />
        <Route path="/signup" element={<SignupRoute />} />
        <Route path="/reset-password" element={<PasswordResetRoute />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/chatroom/:roomId" element={<ChatRoom />} />
        <Route path="/mypage" element={<MyPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
