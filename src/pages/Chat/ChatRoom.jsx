import { useState, useEffect, useRef } from 'react'
import ChatMessage from '../../components/Chat/ChatMessage'
import { useParams, useLocation } from 'react-router-dom'

import Nav from '../../components/Nav'
import ConfirmModal from '../../components/Home/ConfirmModal'
import ChatRoomHeader from '../../components/Chat/ChatRoomHeader'
import ChatRoomInput from '../../components/Chat/ChatRoomInput'
import useChatSocket from '../../hooks/useChatSocket'
import { getSavedUser } from '../../api/token'
import { getChatMessages, markChatAsRead } from '../../api/chat'
import { commonCourses } from '../../api/chat'

const ChatRoom = () => {
    const { roomId } = useParams()
    const { state } = useLocation()
    const opponent = state?.opponent

    const [isModal, setIsModal] = useState(false)
    const [selectedCourse, setSelectedCourse] = useState('')
    const [prevMessages, setPrevMessages] = useState([])
    const chatContentRef = useRef(null)

    const { messages, sendMessage } = useChatSocket(roomId)
    const myUser = getSavedUser()

    const [courseList, setCourseList] = useState([])

    // 이전 메시지 조회
    useEffect(() => {
        if (!roomId) return
        const fetchMessages = async () => {
            try {
                const result = await getChatMessages(roomId)
                const normalized = (result.messages ?? [])
                    .map((msg) => ({
                        ...msg,
                        senderId: msg.senderId ?? msg.sender?.userId,
                        senderNickname: msg.senderNickname ?? msg.sender?.nickname,
                    }))
                    .reverse()
                setPrevMessages(normalized)
                const lastMsg = normalized[normalized.length - 1]
                const lastMsgId = lastMsg?.messageId ?? lastMsg?.id ?? lastMsg?.chatMessageId
                if (lastMsgId) {
                    markChatAsRead(roomId, lastMsgId).catch((e) => console.error('읽음 처리 실패', e))
                } else if (lastMsg) {
                    console.warn('[markChatAsRead] 메시지 ID 필드를 찾을 수 없습니다:', lastMsg)
                }
            } catch (e) {
                console.error('메시지 조회 실패', e)
            }
        }
        fetchMessages()
    }, [roomId])

    // 실시간 메시지 수신 시 읽음 처리 (수신자/송신자 모두 읽음 처리하여 배지 제거)
    useEffect(() => {
        if (messages.length === 0) return
        const lastMsg = messages[messages.length - 1]
        const lastMsgId = lastMsg?.messageId ?? lastMsg?.id ?? lastMsg?.chatMessageId
        if (lastMsgId) {
            markChatAsRead(roomId, lastMsgId).catch((e) => console.error('읽음 처리 실패', e))
        } else if (lastMsg) {
            console.warn('[markChatAsRead] 메시지 ID 필드를 찾을 수 없습니다:', lastMsg)
        }
    }, [messages])

    //공통 과목 조회
    useEffect(() => {
    if (!roomId) return
    commonCourses(roomId)
        .then((data) => {
            const list = data?.courses ?? []
            setCourseList(list.map((c) => c.courseName))
        })
        .catch((e) => console.error('공통과목 조회 실패', e))
    }, [roomId])

    // 새 메시지 오면 스크롤 아래로
    useEffect(() => {
        const el = chatContentRef.current
        if (!el) return
        const raf = requestAnimationFrame(() => {
            el.scrollTop = el.scrollHeight
        })
        return () => cancelAnimationFrame(raf)
    }, [prevMessages, messages])

    const allMessages = [...prevMessages, ...messages]

    return (
        <div id="ChatRoom_Wrap" className="container">
            <ChatRoomHeader
                roomId={opponent?.nickname ?? roomId}
                isModalOpen={() => setIsModal((prev) => !prev)}
                total={2}
            />
            <div id="ChatContent_Wrap" ref={chatContentRef}>
                {allMessages.map((msg, i) => (
                    <ChatMessage
                        key={i}
                        text={msg.content}
                        isMe={msg.senderId === myUser?.userId}
                        sender={msg.senderNickname}
                    />
                ))}
            </div>
            <ChatRoomInput sendMessage={sendMessage} />
            {isModal && (
                <ConfirmModal
                    title="팀원 요청을 보내시겠습니까?"
                    description="팀원 요청을 보내고자 하는 과목명을 선택해주세요"
                    cancelText="아니오"
                    confirmText="네"
                    isModalOpen={() => setIsModal(false)}
                    onConfirm={() => setIsModal(false)}
                    dropdownList={courseList}
                    onCourseChange={setSelectedCourse}
                    hasDropdown={true}
                />
            )}
            <Nav />
        </div>
    )
}

export default ChatRoom
