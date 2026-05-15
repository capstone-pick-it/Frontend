import React from 'react'
import profile from '../../assets/images/Chat/profile.svg'
import ChatBadge from './ChatBadge'
import { useNavigate } from 'react-router-dom'
import { USERS } from '../../data/mockData'
import { GROUP_USERS } from '../../data/mockData'
import profile3 from '../../assets/images/Chat/group_profile_3.svg'
import profile4 from '../../assets/images/Chat/group_profile_4.svg'
import profile5 from '../../assets/images/Chat/group_profile_5.svg'

const GroupChatList = () => {
    const navigate = useNavigate();
    const group_users = GROUP_USERS

  return (
    <div className="GroupChatContainer_Wrap">
        {group_users?.map((group) => (
            <div
                key={group.id}
                className='ChatList_Wrap'
                onClick={() => navigate(`/chatroom/${group.courseName}`)}
            >
                <img src={profile5} alt="" />
                <div className="text_container">
                    <div>
                        <h1>{group.courseName}</h1>
                        <p>{group.total}</p>
                    </div>
                    <p>{group.message}</p>
                </div>
                <ChatBadge/>
            </div>
        ))}
    </div>
  )
}

export default GroupChatList