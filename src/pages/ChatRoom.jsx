import React from 'react'
import team_request from '../assets/images/Chat/user-add.svg'
import team_accept from '../assets/images/Chat/user-tick.svg'
import ChatMessage from '../components/Chat/ChatMessage'
import { useParams } from 'react-router-dom'
import { CHAT_MESSAGES } from '../data/mockData'
import Nav from '../components/Nav'
import send from '../assets/images/Chat/send.svg'

const ChatRoom = () => {
    const { roomId } = useParams();
    const message = CHAT_MESSAGES[roomId] || [];
    
  return (
    <div id="ChatRoom_Wrap" className="container">
        <header>
            <h1>{roomId}</h1>
            <img src={team_request} alt="" />
        </header>

        <div id="ChatContent_Wrap">
            {message.map((msg) => (
                <ChatMessage
                    key={msg.id}
                    text={msg.text}
                    isMe={msg.isMe}
                    sender={roomId}
                />
            ))}
        </div>

        <footer>
            <input type="text" />
            <button className="send_btn">
                <img src={send} alt="" />
            </button>
        </footer>
        
        <Nav/>
    </div>
  )
}

export default ChatRoom