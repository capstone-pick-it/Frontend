import React from 'react'
import Nav from '../components/Nav'
import ChatList from '../components/Chat/ChatList'

const Chat = () => {
  return (
    <div id="Chat_Wrap" className="container">
        <ChatList/>
        <Nav/>
    </div>
  )
}

export default Chat