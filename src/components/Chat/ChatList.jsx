import React from 'react'
import profile from '../../assets/images/Chat/profile.svg'
import ChatBadge from './ChatBadge'
import { useNavigate } from 'react-router-dom'

const ChatList = () => {
    const navigate = useNavigate();

    //채팅방 리스트 더미데이터
    const users = [
        { id: 1, name: "김성연", message: "팀 하실래여"},
        { id: 2, name: "이은우", message: "팀원 구하셨어요??"}
    ]

  return (
    <div id="ChatContainer_Wrap">
        {users.map((user) => (
            <div
                key={user.id}
                id='ChatList_Wrap'
                onClick={() => navigate(`/chatroom/${user.name}`)}
            >
                <img src={profile} alt="" />
                <div className="text_container">
                    <h1>{user.name}</h1>
                    <p>{user.message}</p>
                </div>
                <ChatBadge/>
            </div>
        ))}
    </div>
  )
}

export default ChatList