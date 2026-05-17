import React from 'react'
import { useParams } from 'react-router-dom'
import Nav from '../../components/Nav'
import ChatList from '../../components/Chat/ChatList'
import ChatRoom from './ChatRoom'
import TopBar from '../../components/TopBar'

const Chat = () => {
    const { roomId } = useParams();
  return (
    <div id="Chat_Wrap" className="container">
       <TopBar title={"채팅"}/>
        <ChatList/>
        {roomId && <ChatRoom/>} 
        <Nav/>
    </div>
  )
}

export default Chat