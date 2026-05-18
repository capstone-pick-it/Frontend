import React from 'react'
import Nav from '../../components/Nav'
import ChatList from '../../components/Chat/ChatList'
import TopBar from '../../components/TopBar'
import GroupChatList from '../../components/Chat/GroupChatList'

const Chat = () => {
  return (
    <div id="Chat_Wrap" className="container">
       <TopBar title={"채팅"}/>
        <ChatList/>
        <GroupChatList/>
        <Nav/>
    </div>
  )
}

export default Chat