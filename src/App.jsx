import React from 'react'
import logo from './assets/images/logo.png'
import Nav from './components/Nav'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Chat from './pages/Chat'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/chat' element={<Chat />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App