import React from 'react'
import back from '../../assets/images/Chat/back.svg'
import team_request from '../../assets/images/Chat/user-add.svg'
import { Link, useParams } from 'react-router-dom'
import profile_xs from '../../assets/images/Chat/profile_xs.svg'
import { GROUP_USERS } from '../../data/mockData'

const ChatRoomHeader = ({ roomId, isModalOpen, total }) => {

  return (
    <div className="ChatRoomHeader_Wrap">
        <div className='text_container'>
            <div className='title_container'>
                <Link to="/chat">
                    <img src={back} alt="" />
                </Link>
                <h1>{roomId}</h1>
            </div>
            {Number(total) >= 3 && (
                <div className='info_container'>
                    <img src={profile_xs} alt="" />
                    <p>{total}</p>
                </div>
            )}
        </div>
        {Number(total) < 3 &&(
            <img src={team_request} onClick={isModalOpen} alt="" />
        ) }
    </div>
  )
}

export default ChatRoomHeader