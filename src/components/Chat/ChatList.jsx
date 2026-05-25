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
                const rooms = result.chatRooms.map((room) =>
                    sessionStorage.getItem(`read_${room.chatRoomId}`)
                        ? { ...room, unreadCount: 0 }
                        : room
                )
                setChatRooms(rooms)
            } catch (e) {
                console.error('채팅 목록 조회 실패', e)
            }
        }
        fetchChatRooms()
    }, [])

    const handleClick = async (targetUserId, opponent, chatRoomId) => {
        sessionStorage.setItem(`read_${chatRoomId}`, 'true')
        setChatRooms((prev) =>
            prev.map((room) =>
                room.chatRoomId === chatRoomId ? { ...room, unreadCount: 0 } : room
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