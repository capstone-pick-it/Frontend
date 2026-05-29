import { useCallback, useRef, useState } from 'react'
import ChatBadge from './ChatBadge'
import ConfirmModal from '../Home/ConfirmModal'
import { useNavigate } from 'react-router-dom'
import profile5 from '../../assets/images/Chat/group_profile_5.svg'
import { leaveChatRoom } from '../../api/chat'

const SWIPE_THRESHOLD = 50
const SWIPE_WIDTH = 80

const GroupChatList = ({ rooms, setRooms }) => {
    const navigate = useNavigate()
    const [swipedRoomId, setSwipedRoomId] = useState(null)
    const [confirmRoomId, setConfirmRoomId] = useState(null)
    const swipedRoomIdRef = useRef(null)
    const itemRefs = useRef({})
    const startX = useRef(0)
    const isDragging = useRef(false)
    const hasSwiped = useRef(false)

    const setSwipedRoom = useCallback((roomId) => {
        swipedRoomIdRef.current = roomId
        setSwipedRoomId(roomId)
    }, [])

    const handlePointerDown = (e) => {
        startX.current = e.clientX
        isDragging.current = true
        hasSwiped.current = false
        e.currentTarget.setPointerCapture(e.pointerId)
    }

    const handlePointerMove = (e, roomId) => {
        if (!isDragging.current) return
        const deltaX = e.clientX - startX.current
        if (Math.abs(deltaX) < 5) return

        hasSwiped.current = true
        const base = swipedRoomIdRef.current === roomId ? -SWIPE_WIDTH : 0
        const offset = Math.min(0, Math.max(-SWIPE_WIDTH, base + deltaX))
        const el = itemRefs.current[roomId]
        if (el) {
            el.style.transition = 'none'
            el.style.transform = `translateX(${offset}px)`
        }
    }

    const handlePointerUp = (e, roomId) => {
        if (!isDragging.current) return
        isDragging.current = false

        const deltaX = e.clientX - startX.current
        const currentlyOpen = swipedRoomIdRef.current === roomId
        const shouldOpen = currentlyOpen ? deltaX < -30 : deltaX < -SWIPE_THRESHOLD

        const el = itemRefs.current[roomId]
        if (el) {
            el.style.transition = 'transform 0.25s ease'
            el.style.transform = shouldOpen ? `translateX(-${SWIPE_WIDTH}px)` : 'translateX(0)'
            setTimeout(() => {
                el.style.transition = ''
                el.style.transform = ''
                setSwipedRoom(shouldOpen ? roomId : null)
            }, 250)
        }
    }

    const handleClick = (room) => {
        if (hasSwiped.current) return
        if (swipedRoomId) { setSwipedRoom(null); return }
        navigate(`/chatroom/${room.chatRoomId}`, {
            state: { opponent: { nickname: room.roomName } },
        })
    }

    const handleLeave = async () => {
        try {
            await leaveChatRoom(confirmRoomId)
            setRooms((prev) => prev.filter((r) => r.chatRoomId !== confirmRoomId))
        } catch (e) {
            console.error('그룹 채팅방 나가기 실패', e)
        } finally {
            setConfirmRoomId(null)
            setSwipedRoom(null)
        }
    }

    return (
        <div>
            {rooms?.map((room) => (
                <div key={room.chatRoomId} className="GroupChatList_Slide_Wrap">
                    <div
                        ref={(el) => (itemRefs.current[room.chatRoomId] = el)}
                        className={`GroupChatContainer_Wrap${swipedRoomId === room.chatRoomId ? ' swiped' : ''}`}
                        onPointerDown={handlePointerDown}
                        onPointerMove={(e) => handlePointerMove(e, room.chatRoomId)}
                        onPointerUp={(e) => handlePointerUp(e, room.chatRoomId)}
                        onClick={() => handleClick(room)}
                    >
                        <img src={profile5} alt="" />
                        <div className="text_container">
                            <div>
                                <h1>{room.roomName}</h1>
                                <p>{room.participantCount}</p>
                            </div>
                            <p>{room.lastMessage ?? ''}</p>
                        </div>
                        <ChatBadge count={room.unreadCount} />
                    </div>
                    <button
                        className="leave-btn"
                        onClick={() => setConfirmRoomId(room.chatRoomId)}
                    >
                        나가기
                    </button>
                </div>
            ))}
            {confirmRoomId && (
                <ConfirmModal
                    title="채팅방을 나가시겠습니까?"
                    cancelText="아니오"
                    confirmText="나가기"
                    onCancel={() => setConfirmRoomId(null)}
                    onConfirm={handleLeave}
                />
            )}
        </div>
    )
}

export default GroupChatList
