import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import logo from './assets/images/logo.png'
import Nav from './components/Nav'
import './assets/sass/style.scss';

// 마이페이지 관련 경로 import
import MyPage from './pages/MyPage';

// Chat 페이지 관련 경로 import
import Chat from './pages/Chat'
import ChatRoom from './pages/ChatRoom'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/chat' element={<Chat />} />
        <Route path='/chatroom/:roomId' element={<ChatRoom />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App