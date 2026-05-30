import { useEffect, useState } from 'react'
import Nav from '../../components/Nav'
import ChatList from '../../components/Chat/ChatList'
import TopBar from '../../components/TopBar'
import GroupChatList from '../../components/Chat/GroupChatList'
import { getChatRooms } from '../../api/chat'
import useChatNotifications from '../../hooks/useChatNotifications'

const Chat = () => {
  const [directRooms, setDirectRooms] = useState([])
  const [groupRooms, setGroupRooms] = useState([])
  const { notification } = useChatNotifications()

  useEffect(() => {
    getChatRooms()
      .then((result) => {
        const rooms = result.chatRooms ?? []
        console.log('[ChatRooms] 전체 응답:', rooms)
        setDirectRooms(rooms.filter((r) => r.chatType === 'DIRECT'))
        setGroupRooms(rooms.filter((r) => r.chatType !== 'DIRECT'))
      })
      .catch((e) => console.error('채팅 목록 조회 실패', e))
  }, [])

  useEffect(() => {
    if (!notification) return
    const { chatRoomId, lastMessage, unreadCount } = notification
    const updater = (prev) =>
      prev.map((room) =>
        room.chatRoomId === chatRoomId ? { ...room, lastMessage, unreadCount } : room
      )
    setDirectRooms(updater)
    setGroupRooms(updater)
  }, [notification])

  return (
    <div id="Chat_Wrap" className="container">
      <TopBar title="채팅" />
      <ChatList rooms={directRooms} setRooms={setDirectRooms} />
      <GroupChatList rooms={groupRooms} setRooms={setGroupRooms} />
      <Nav />
    </div>
  )
}

export default Chat
