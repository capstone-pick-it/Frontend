import { useEffect, useState } from 'react'
import profile from '../../assets/images/Chat/profile.svg'
import ChatBadge from './ChatBadge'
import { useNavigate } from 'react-router-dom'
import { createDirectChat, getChatRooms } from '../../api/chat'

const ChatList = () => {
    const navigate = useNavigate()
    const [chatRooms, setChatRooms] = useState([])

    useEffect(() => {
        const fetchChatRooms = async () => {
            try {
                const result = await getChatRooms()
                setChatRooms(result.chatRooms ?? [])
            } catch (e) {
                console.error('채팅 목록 조회 실패', e)
            }
        }
        fetchChatRooms()
    }, [])

    const handleClick = async (targetUserId, opponent, chatRoomId) => {
        // 낙관적 업데이트: 입장 즉시 배지 제거
        setChatRooms((prev) =>
            prev.map((r) =>
                r.chatRoomId === chatRoomId ? { ...r, unreadCount: 0 } : r
            )
        )
        try {
            const result = await createDirectChat(targetUserId)
            navigate(`/chatroom/${result.chatRoomId}`, {
                state: { opponent: result.opponent ?? opponent },
            })
        } catch (e) {
            console.error('채팅방 입장 실패', e)
            alert(`채팅방 입장 실패: ${e.message}`)
        }
    }

    return (
        <div className="ChatContainer_Wrap">
            {chatRooms?.map((room) => (
                <div
                    key={room.chatRoomId}
                    className='ChatList_Wrap'
                    onClick={() => handleClick(room.opponent.userId, room.opponent, room.chatRoomId)}
                >
                    <img src={profile} alt="" />
                    <div className="text_container">
                        <h1>{room.opponent.nickname}</h1>
                        <p>{room.lastMessage ?? ''}</p>
                    </div>
                    <ChatBadge count={room.unreadCount} />
                </div>
            ))}
        </div>
    )
}

export default ChatList