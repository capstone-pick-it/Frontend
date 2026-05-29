import { useEffect, useState } from 'react'
import Nav from '../../components/Nav'
import ChatList from '../../components/Chat/ChatList'
import TopBar from '../../components/TopBar'
import GroupChatList from '../../components/Chat/GroupChatList'
import { getChatRooms } from '../../api/chat'

const Chat = () => {
  const [directRooms, setDirectRooms] = useState([])
  const [groupRooms, setGroupRooms] = useState([])

  useEffect(() => {
    getChatRooms()
      .then((result) => {
        const rooms = result.chatRooms ?? []
        setDirectRooms(rooms.filter((r) => r.chatType === 'DIRECT'))
        setGroupRooms(rooms.filter((r) => r.chatType !== 'DIRECT'))
      })
      .catch((e) => console.error('채팅 목록 조회 실패', e))
  }, [])

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
