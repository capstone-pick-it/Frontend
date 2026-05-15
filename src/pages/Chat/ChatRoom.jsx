import React from 'react'
import team_request from '../../assets/images/Chat/user-add.svg'
// import team_accept from '../../assets/images/Chat/user-tick.svg' // 현재 해당 svg 파일 없음
import ChatMessage from '../../components/Chat/ChatMessage'
import { useParams } from 'react-router-dom'
import { CHAT_MESSAGES } from '../../data/mockData'
import Nav from '../../components/Nav'
import send from '../../assets/images/Chat/send.svg'
import back from '../../assets/images/Chat/back.svg'
import ChatToast from '../../components/Chat/ChatToast' 
import { Link } from 'react-router-dom'
import { TEAM_STATUS } from '../../data/mockData'
import ConfirmModal from '../../components/Home/ConfirmModal'
import { useState } from 'react'
import ModalDropdown from '../../components/Chat/ModalDropDown'

const ChatRoom = () => {
    const { roomId } = useParams();
    const message = CHAT_MESSAGES[roomId] || [];
    const status = TEAM_STATUS[roomId];
    
    const [isModal, setIsModal] = useState(false)
    const isModalOpen = () =>{
        setIsModal((prev) => !prev)
    }
    
  return (
    <div id="ChatRoom_Wrap" className="container">
        <header>
            <div>
                <Link to="/chat">
                    <img src={back} alt="" />
                </Link>
                <h1>{roomId}</h1>
            </div>
            <img src={team_request} onClick={isModalOpen} alt="" />
        </header>

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
       
        <footer>
            <input type="text" />
            <button className="send_btn">
                <img src={send} alt="" />
            </button>
        </footer>

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
