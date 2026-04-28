import React from 'react'
import team_request from '../assets/images/Chat/user-add.svg'
import team_accept from '../assets/images/Chat/user-tick.svg'
import { useParams } from 'react-router-dom'

const ChatRoom = () => {
    const { roomId } = useParams();
  return (
    <div id="ChatRoom_Wrap" className="container">
        <header>
            <h1>{roomId}</h1>
            <img src={team_request} alt="" />
        </header>
    </div>
  )
}

export default ChatRoom