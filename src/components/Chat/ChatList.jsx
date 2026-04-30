import React from 'react'
import profile from '../../assets/images/Chat/profile.svg'
import ChatBadge from './ChatBadge'
import { useNavigate } from 'react-router-dom'
import { USERS } from '../../data/mockData'

const ChatList = () => {
    const navigate = useNavigate();
    const users = USERS;

  return (
    <div className="ChatContainer_Wrap">
        {users?.map((user) => (
            <div
                key={user.id}
                className='ChatList_Wrap'
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