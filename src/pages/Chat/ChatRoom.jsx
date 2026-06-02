import { useState, useEffect, useRef } from 'react'
import ChatMessage from '../../components/Chat/ChatMessage'
import { useParams, useLocation } from 'react-router-dom'

import Nav from '../../components/Nav'
import ConfirmModal from '../../components/Home/ConfirmModal'
import ChatRoomHeader from '../../components/Chat/ChatRoomHeader'
import ChatRoomInput from '../../components/Chat/ChatRoomInput'
import useChatSocket from '../../hooks/useChatSocket'
import ChatToast from '../../components/Chat/ChatToast'
import { getSavedUser } from '../../api/token'
import { getChatMessages, markChatAsRead, commonCourses, teamRequest, getLatestTeamRequest, acceptTeamRequest } from '../../api/chat'
import { useChatRooms } from '../../context/ChatRoomsContext'

const ChatRoom = () => {
    const { roomId } = useParams()
    const { state } = useLocation()
    const { directRooms, groupRooms, fetchRooms, setDirectRooms, setGroupRooms } = useChatRooms()

    const [recoveredRoom, setRecoveredRoom] = useState(null)

    useEffect(() => {
        if (state) return
        const found = [...directRooms, ...groupRooms].find(
            (r) => String(r.chatRoomId) === String(roomId)
        )
        if (found) {
            setRecoveredRoom(found)
        } else {
            fetchRooms()
        }
    }, [roomId, directRooms, groupRooms, state])

    // 채팅방 진입 시 context의 unreadCount 즉시 0으로 갱신
    useEffect(() => {
        if (!roomId) return
        const resetUnread = (rooms) =>
            rooms.map((r) => String(r.chatRoomId) === String(roomId) ? { ...r, unreadCount: 0 } : r)
        setDirectRooms(resetUnread)
        setGroupRooms(resetUnread)
    }, [roomId])

    const opponent = state?.opponent ?? recoveredRoom?.opponent
    const isGroup = state ? state.chatType === 'GROUP' : recoveredRoom?.chatType !== 'DIRECT'
    const participantCount = state?.participantCount ?? recoveredRoom?.participantCount ?? 2
    const roomName = state?.roomName ?? recoveredRoom?.roomName

    const [isModal, setIsModal] = useState(false)
    const [toastStatus, setToastStatus] = useState(null)
    const [selectedCourse, setSelectedCourse] = useState('')
    const [prevMessages, setPrevMessages] = useState([])
    const chatContentRef = useRef(null)
    const myRoleRef = useRef(null)
    const teamRequestIdRef = useRef(null)

    const { messages, sendMessage, teamRequestEvent, clearMessages, readEvent } = useChatSocket(roomId)
    const myUser = getSavedUser()

    const [courseList, setCourseList] = useState([])

    const normalize = (msgs) =>
        (msgs ?? []).map((msg) => ({
            ...msg,
            senderId: msg.senderId ?? msg.sender?.userId,
            senderNickname: msg.senderNickname ?? msg.sender?.nickname,
        })).reverse()

    const fetchMessages = async () => {
        try {
            const result = await getChatMessages(roomId)
            const normalized = normalize(result.messages)
            setPrevMessages(normalized)

            const lastMsg = normalized[normalized.length - 1]
            const lastMsgId = lastMsg?.messageId ?? lastMsg?.id ?? lastMsg?.chatMessageId
            if (lastMsgId) {
                await markChatAsRead(roomId, lastMsgId)
                // 읽음 처리 후 재조회로 unreadMemberCount 최신화
                const refreshed = await getChatMessages(roomId)
                setPrevMessages(normalize(refreshed.messages))
            } else if (lastMsg) {
                console.warn('[markChatAsRead] 메시지 ID 필드를 찾을 수 없습니다:', lastMsg)
            }
        } catch (e) {
            console.error('메시지 조회 실패', e)
        }
    }

    // 이전 메시지 조회
    useEffect(() => {
        if (!roomId) return
        fetchMessages()
    }, [roomId])

    // 실시간 메시지 수신 시 읽음 처리
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

    //공통 과목 조회 (1:1만)
    useEffect(() => {
        if (!roomId || isGroup) return
        commonCourses(roomId)
            .then((data) => {
                const list = data?.courses ?? []
                setCourseList(list)
                if (list.length > 0) setSelectedCourse(list[0].courseName)
            })
            .catch((e) => console.error('공통과목 조회 실패', e))
    }, [roomId, isGroup])

    // 팀원 요청 최신 상태 초기화 (1:1만)
    useEffect(() => {
        if (!roomId || isGroup) return
        getLatestTeamRequest(roomId)
            .then((result) => {
                if (!result) return
                myRoleRef.current = result.role
                teamRequestIdRef.current = result.teamRequestId
                if (result.status === 'PENDING') {
                    if (result.role === 'SENDER') setToastStatus('WAITING')
                    else if (result.role === 'RECEIVER') setToastStatus('REQUEST')
                } else if (result.status === 'REJECTED' && result.role === 'SENDER') {
                    setToastStatus('REJECTED')
                    setTimeout(() => setToastStatus(null), 2000)
                }
            })
            .catch((e) => console.error('[TeamRequest] 조회 실패:', e))
    }, [roomId])

    // 팀원 요청 이벤트 수신 (1:1만)
    useEffect(() => {
        if (!teamRequestEvent || isGroup) return
        if (teamRequestEvent.type === 'TEAM_REQUEST_CREATED') {
            if (myRoleRef.current !== 'SENDER') {
                myRoleRef.current = 'RECEIVER'
                teamRequestIdRef.current = teamRequestEvent.teamRequestId
                setToastStatus('REQUEST')
            }
        } else if (teamRequestEvent.type === 'TEAM_REQUEST_ACCEPTED') {
            if (myRoleRef.current === 'SENDER') {
                setToastStatus(null)
            } else if (myRoleRef.current === 'RECEIVER') {
                setToastStatus('ACCEPTED')
                setTimeout(() => setToastStatus(null), 2000)
            }
        } else if (teamRequestEvent.type === 'TEAM_REQUEST_REJECTED') {
            if (myRoleRef.current === 'SENDER') {
                setToastStatus('REJECTED')
                setTimeout(() => setToastStatus(null), 2000)
            } else if (myRoleRef.current === 'RECEIVER') {
                setToastStatus(null)
            }
        }
    }, [teamRequestEvent])

    // 팀원 요청 전송
    const handleTeamRequest = async () => {
        const course = courseList.find((c) => c.courseName === selectedCourse)
        if (!course) return
        try {
            const result = await teamRequest(roomId, course.courseId)
            myRoleRef.current = 'SENDER'
            teamRequestIdRef.current = result?.teamRequestId
            setIsModal(false)
            setToastStatus('WAITING')
        } catch (e) {
            console.error('팀원 요청 실패', e)
        }
    }

    // 팀원 요청 수락
    const handleAccept = async () => {
        if (!teamRequestIdRef.current) return
        try {
            await acceptTeamRequest(roomId, teamRequestIdRef.current)
        } catch (e) {
            console.error('팀원 요청 수락 실패', e)
        }
    }

    // 읽음 이벤트 수신 시 prevMessages unreadMemberCount 갱신
    useEffect(() => {
        if (!readEvent) return
        const lastReadId = readEvent.messageRead.lastReadMessageId
        setPrevMessages((prev) => prev.map((msg) => {
            const msgId = msg.messageId ?? msg.id ?? msg.chatMessageId
            if (msgId <= lastReadId && (msg.unreadMemberCount ?? 0) > 0) {
                return { ...msg, unreadMemberCount: msg.unreadMemberCount - 1 }
            }
            return msg
        }))
    }, [readEvent])

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
                roomId={isGroup ? roomName : opponent?.nickname}
                isModalOpen={() => setIsModal((prev) => !prev)}
                total={participantCount}
                isGroup={isGroup}
            />
            <div id="ChatContent_Wrap" ref={chatContentRef}>
                {allMessages.map((msg, i) => (
                    <ChatMessage
                        key={i}
                        text={msg.content}
                        files={msg.files}
                        isMe={msg.senderId === myUser?.userId}
                        sender={msg.senderNickname}
                        unreadCount={isGroup ? (msg.unreadMemberCount ?? 0) : 0}
                    />
                ))}
            </div>
            {!isGroup && <ChatToast status={toastStatus} onAccept={handleAccept} />}
            <ChatRoomInput
                sendMessage={sendMessage}
                isGroup={isGroup}
                onFileSent={async () => { await fetchMessages(); clearMessages() }}
            />
            {isModal && !isGroup && (
                <ConfirmModal
                    title="팀원 요청을 보내시겠습니까?"
                    description="팀원 요청을 보내고자 하는 과목명을 선택해주세요"
                    cancelText="아니오"
                    confirmText="네"  
                    onCancel={() => setIsModal(false)}
                    onConfirm={handleTeamRequest}
                    dropdownList={courseList.map((c) => c.courseName)}
                    onCourseChange={setSelectedCourse}
                    hasDropdown={true}
                />
            )}
            <Nav />
        </div>
    )
}

export default ChatRoom
