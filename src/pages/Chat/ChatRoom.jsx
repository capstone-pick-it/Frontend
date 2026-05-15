import React from 'react'
import ChatMessage from '../../components/Chat/ChatMessage'
import { useLocation, useParams } from 'react-router-dom'
import { CHAT_MESSAGES } from '../../data/mockData'
import Nav from '../../components/Nav'
import ChatToast from '../../components/Chat/ChatToast' 
import { TEAM_STATUS } from '../../data/mockData'
import ConfirmModal from '../../components/Home/ConfirmModal'
import { useState } from 'react'
import ChatRoomHeader from '../../components/Chat/ChatRoomHeader'
import ChatRoomInput from '../../components/Chat/ChatRoomInput'
import { GROUP_USERS } from '../../data/mockData'

const ChatRoom = () => {
    const { roomId } = useParams();

    const currentRoom = GROUP_USERS.find((group) => group.courseName === roomId);
    const total = currentRoom?.total || "0";

    const message = CHAT_MESSAGES[roomId] || [];
    const status = TEAM_STATUS[roomId];
    
    const [isModal, setIsModal] = useState(false)
    const isModalOpen = () =>{
        setIsModal((prev) => !prev)
    }
    
  return (
    <div id="ChatRoom_Wrap" className="container">
       <ChatRoomHeader roomId={roomId} isModalOpen={isModalOpen} total={total} />
        <div id="ChatContent_Wrap">
            {message?.map((msg) => (
                <ChatMessage
                    key={msg.id}
                    text={msg.text}
                    isMe={msg.isMe}
                    sender={roomId}
                />
            ))}
        </div>
        <ChatRoomInput total={total}/>
        <ChatToast/>
        {isModal && (
            <ConfirmModal
            title="팀원 요청을 보내시겠습니까?"
            description="팀원 요청을 보내고자 하는 과목명을 선택해주세요"
            cancelText="아니오"
            confirmText="네"
            isModalOpen={() => setIsModal(false)}
            hasDropdown={true} />
        )}
        <Nav/>
    </div>
  )
}

export default ChatRoom
