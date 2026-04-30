import React from 'react'
import profile from '../../assets/images/Chat/profile.svg'

const ChatMessage = ({ text, isMe, sender}) => {
  return (
    <div className={`ChatMessage_Wrap ${isMe ? 'me' : 'other'}`}>
        {!isMe && <img src={profile} alt="" className='chat_profile' /> }
        <div className="message_container">
            {!isMe && <p>{sender}</p>}
            <div className="message">
                {text}
            </div>
        </div>
    </div>
  )
}

export default ChatMessage