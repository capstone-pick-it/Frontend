import { useCallback, useRef, useState } from 'react'
import profile from '../../assets/images/Chat/profile.svg'
import ChatBadge from './ChatBadge'
import ConfirmModal from '../Home/ConfirmModal'
import { useNavigate } from 'react-router-dom'
import { createDirectChat, leaveChatRoom } from '../../api/chat'

const SWIPE_THRESHOLD = 50
const SWIPE_WIDTH = 80
const UNKNOWN_OPPONENT_NAME = '알 수 없는 사용자'

const getSafeOpponent = (opponent, fallback = {}) => {
    const userId = opponent?.userId ?? fallback.userId
    const nickname = opponent?.nickname || fallback.nickname || UNKNOWN_OPPONENT_NAME

    return {
        ...fallback,
        ...opponent,
        userId,
        nickname,
    }
}

const ChatList = ({ rooms, setRooms }) => {
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

    const handleClick = async (room) => {
        if (hasSwiped.current) return
        if (swipedRoomId) { setSwipedRoom(null); return }

        const chatRoomId = room.chatRoomId
        const opponent = getSafeOpponent(room.opponent)

        setRooms((prev) =>
            prev.map((r) => r.chatRoomId === chatRoomId ? { ...r, unreadCount: 0 } : r)
        )

        if (!opponent.userId) {
            navigate(`/chatroom/${chatRoomId}`, {
                state: { opponent },
            })
            return
        }

        try {
            const result = await createDirectChat(opponent.userId)
            navigate(`/chatroom/${result.chatRoomId ?? chatRoomId}`, {
                state: { opponent: getSafeOpponent(result.opponent, opponent) },
            })
        } catch (e) {
            console.error('채팅방 입장 실패', e)
            alert(`채팅방 입장 실패: ${e.message}`)
        }
    }

    const handleLeave = async () => {
        try {
            await leaveChatRoom(confirmRoomId)
            setRooms((prev) => prev.filter((r) => r.chatRoomId !== confirmRoomId))
        } catch (e) {
            console.error('채팅방 나가기 실패', e)
        } finally {
            setConfirmRoomId(null)
            setSwipedRoom(null)
        }
    }

    return (
        <div className="ChatContainer_Wrap">
            {rooms?.map((room) => {
                const opponent = getSafeOpponent(room.opponent)

                return (
                    <div key={room.chatRoomId} className="ChatList_Slide_Wrap">
                        <div
                            ref={(el) => (itemRefs.current[room.chatRoomId] = el)}
                            className={`ChatList_Wrap${swipedRoomId === room.chatRoomId ? ' swiped' : ''}`}
                            onPointerDown={handlePointerDown}
                            onPointerMove={(e) => handlePointerMove(e, room.chatRoomId)}
                            onPointerUp={(e) => handlePointerUp(e, room.chatRoomId)}
                            onClick={() => handleClick(room)}
                        >
                            <img src={profile} alt="" />
                            <div className="text_container">
                                <h1>{opponent.nickname}</h1>
                                <p>{room.lastMessage ?? ''}</p>
                            </div>
                            <ChatBadge
                                count={room.unreadCount}
                                teamRequest={room.badgeType === 'TEAM_REQUEST'}
                            />
                        </div>
                        <button
                            className="leave-btn"
                            onClick={() => setConfirmRoomId(room.chatRoomId)}
                        >
                            나가기
                        </button>
                    </div>
                )
            })}
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

export default ChatList
