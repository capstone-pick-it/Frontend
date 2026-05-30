import React from 'react'
import send from '../../assets/images/Chat/send.svg'
import add from '../../assets/images/Chat/add.svg'
import { useState } from 'react'

const ChatRoomInput = ({ sendMessage, isGroup }) => {
  const [text, setText] = useState('')
  const handleSend = () => {
    if (!text.trim()) return
    sendMessage(text.trim())
    setText('')
  }

  return (
    <div className='ChatRoomInput_Wrap'>
       {isGroup && (
         <button className="add_btn">
            <img src={add} alt="" />
        </button>
       )}
        <input
        type="text"
        className={isGroup ? 'with-add-btn' : ''}
        value={text}
        onChange={(e)=>setText(e.target.value)}
        onKeyDown={(e)=>e.key === 'Enter' && handleSend()}
        />
        <button className="send_btn" onClick={handleSend}>
            <img src={send} alt="" />
        </button>
    </div>
  )
}

export default ChatRoomInput