import Nav from '../../components/Nav'
import ChatList from '../../components/Chat/ChatList'
import TopBar from '../../components/TopBar'
import GroupChatList from '../../components/Chat/GroupChatList'
import { useChatRooms } from '../../context/ChatRoomsContext'

const Chat = () => {
  const { directRooms, setDirectRooms, groupRooms, setGroupRooms } = useChatRooms()

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
