import React from 'react'
import profile from '../../assets/images/Chat/profile.svg'
import ChatBadge from './ChatBadge'

const ChatList = () => {
  return (
    <div id="ChatList_Wrap">
        <img src={profile} alt="" />
        <div className="text_container">
            <h1>김성연</h1>
            <p>팀 하실래여</p>
        </div>
        <ChatBadge/>
    </div>
  )
}

export default ChatList