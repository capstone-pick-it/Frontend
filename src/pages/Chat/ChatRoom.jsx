import { useState, useEffect } from 'react'
import ChatMessage from '../../components/Chat/ChatMessage'
import { useParams } from 'react-router-dom'
import { CHAT_MESSAGES, TEAM_STATUS, GROUP_USERS, COURSE_INFO } from '../../data/mockData'
import Nav from '../../components/Nav'
import ChatToast from '../../components/Chat/ChatToast'
import ConfirmModal from '../../components/Home/ConfirmModal'
import ChatRoomHeader from '../../components/Chat/ChatRoomHeader'
import ChatRoomInput from '../../components/Chat/ChatRoomInput'

const ChatRoom = () => {
    const { roomId } = useParams();

    const currentRoom = GROUP_USERS.find((group) => group.courseName === roomId);
    const total = currentRoom?.total || "0";
    const message = CHAT_MESSAGES[roomId] || [];

    const [status, setStatus] = useState(TEAM_STATUS[roomId] || null);
    const [selectedCourse, setSelectedCourse] = useState(COURSE_INFO[0]?.name || '');
    const [isModal, setIsModal] = useState(false);

    // ACCEPTED 상태 2초 후 토스트 제거
    useEffect(() => {
        if (status !== "ACCEPTED") return;
        const timer = setTimeout(() => setStatus(null), 2000);
        return () => clearTimeout(timer);
    }, [status]);

    const handleConfirm = () => {
        // API 연동 시: sendTeamRequest(roomId, selectedCourse)
        setStatus("WAITING");
        setIsModal(false);
    };

    const handleAccept = () => {
        // API 연동 시: acceptTeamRequest(roomId)
        setStatus("ACCEPTED");
    };

  return (
    <div id="ChatRoom_Wrap" className="container">
       <ChatRoomHeader roomId={roomId} isModalOpen={() => setIsModal((prev) => !prev)} total={total} />
        <div id="ChatContent_Wrap">
            {message?.map((msg) => (
                <ChatMessage
                    key={msg.id}
                    text={msg.text}
                    isMe={msg.isMe}
                    sender={msg.senderName ?? roomId}
                />
            ))}
        </div>
        <ChatRoomInput total={total}/>
        {!currentRoom && <ChatToast status={status} onAccept={handleAccept} />}
        {isModal && (
            <ConfirmModal
                title="팀원 요청을 보내시겠습니까?"
                description="팀원 요청을 보내고자 하는 과목명을 선택해주세요"
                cancelText="아니오"
                confirmText="네"
                isModalOpen={() => setIsModal(false)}
                onConfirm={handleConfirm}
                dropdownList={COURSE_INFO.map((c) => c.name)}
                onCourseChange={setSelectedCourse}
                hasDropdown={true}
            />
        )}
        <Nav/>
    </div>
  )
}

export default ChatRoom
