import React from 'react'
import logo from './assets/images/logo.png'
import Nav from './components/Nav'
import './assets/sass/style.scss';
import MyPage from './pages/MyPage';

const App = () => {
  return (
    <div className='container'>
      {/* <img src={logo} alt="" /> */}
      <Nav />
    </div>
  )
}

export default App