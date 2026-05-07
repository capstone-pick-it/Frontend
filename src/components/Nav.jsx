import React from 'react'
import { NavLink } from 'react-router-dom'
import home from '../assets/images/Nav/home.svg'
import recruit from '../assets/images/Nav/recruit.svg'
import chat from '../assets/images/Nav/chat.svg'
import mypage from '../assets/images/Nav/mypage.svg'
import home_b from '../assets/images/Nav/home_b.svg'
import recruit_b from '../assets/images/Nav/recruit_b.svg'
import chat_b from '../assets/images/Nav/chat_b.svg'
import mypage_b from '../assets/images/Nav/mypage_b.svg'

const navItems = [
    { to: '/', label: '홈', icon: home, activeIcon: home_b, className: 'home' },
    { to: '/recruit', label: '모집', icon: recruit, activeIcon: recruit_b, className: 'recruit', imageClassName: 'img_recruit' },
    { to: '/chat', label: '채팅', icon: chat, activeIcon: chat_b, className: 'chat' },
    { to: '/mypage', label: '마이페이지', icon: mypage, activeIcon: mypage_b, className: 'mypage' },
]

const Nav = () => {
  return (
    <div id="Nav_Wrap">
        {navItems.map((item) => (
            <NavLink className={item.className} to={item.to} key={item.to}>
                {({ isActive }) => (
                    <>
                        <img
                            className={item.imageClassName}
                            src={isActive ? item.activeIcon : item.icon}
                            alt=""
                        />
                        <p>{item.label}</p>
                    </>
                )}
            </NavLink>
        ))}
    </div>
  )
}

export default Nav
