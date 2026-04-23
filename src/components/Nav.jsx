import React from 'react'
import home from '../assets/images/Nav/home.svg'
import group from '../assets/images/Nav/group.svg'
import chat from '../assets/images/Nav/chat.svg'
import mypage from '../assets/images/Nav/mypage.svg'
import home_b from '../assets/images/Nav/home_b.svg'
import group_b from '../assets/images/Nav/group_b.svg'
import chat_b from '../assets/images/Nav/chat_b.svg'
import mypage_b from '../assets/images/Nav/mypage_b.svg'

const Nav = () => {
  return (
    <div id="Nav_Wrap">
        <div className="home">
            <img src={home} alt="" />
            <p>홈</p>
        </div>
        <div className="group">
            <img className='img_group' src={group} alt="" />
            <p>모집</p>
        </div>
        <div className="chat">
            <img src={chat} alt="" />
            <p>채팅</p>
        </div>
        <div className="mypage">
            <img src={mypage} alt="" />
            <p>마이페이지</p>
        </div>
    </div>
  )
}

export default Nav