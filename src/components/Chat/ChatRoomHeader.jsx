import React from 'react'
import back from '../../assets/images/Chat/back.svg'
import team_request from '../../assets/images/Chat/user-add.svg'
import { Link, useParams } from 'react-router-dom'
import profile_xs from '../../assets/images/Chat/profile_xs.svg'

const ChatRoomHeader = ({ roomId, isModalOpen, total, isGroup }) => {

  return (
    <div className="ChatRoomHeader_Wrap">
        <div className='text_container'>
            <div className='title_container'>
                <Link to="/chat">
                    <img src={back} alt="" />
                </Link>
                <h1>{roomId}</h1>
            </div>
            {isGroup && (
                <div className='info_container'>
                    <img src={profile_xs} alt="" />
                    <p>{total}</p>
                </div>
            )}
        </div>
        {!isGroup && (
            <button onClick={isModalOpen}>
                <img src={team_request} alt="" />
            </button>
        )}
    </div>
  )
}

export default ChatRoomHeader