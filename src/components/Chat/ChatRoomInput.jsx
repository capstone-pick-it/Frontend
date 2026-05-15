import React from 'react'
import send from '../../assets/images/Chat/send.svg'
import add from '../../assets/images/Chat/add.svg'

const ChatRoomInput = ({ total }) => {
  return (
    <div className='ChatRoomInput_Wrap'>
       {Number(total) > 3 && (
         <button className="add_btn">
            <img src={add} alt="" />
        </button>
       )}
        <input type="text" />
        <button className="send_btn">
            <img src={send} alt="" />
        </button>
    </div>
  )
}

export default ChatRoomInput