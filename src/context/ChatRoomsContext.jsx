import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { getChatRooms } from '../api/chat'
import { getSavedUser } from '../api/token'
import { Client } from '@stomp/stompjs'
import { getAccessToken } from '../api/token'

const ChatRoomsContext = createContext(null)

const WS_URL = import.meta.env.DEV
  ? 'ws://localhost:5173/ws-chat'
  : `wss://${import.meta.env.VITE_API_BASE_URL.replace('https://', '').replace('http://', '')}/ws-chat`

export const ChatRoomsProvider = ({ children }) => {
  const [directRooms, setDirectRooms] = useState([])
  const [groupRooms, setGroupRooms] = useState([])

  const fetchRooms = useCallback(async () => {
    if (!getAccessToken()) return
    try {
      const result = await getChatRooms()
      const rooms = result.chatRooms ?? []
      const sorted = [...rooms].sort(
        (a, b) => new Date(b.lastMessageAt ?? 0) - new Date(a.lastMessageAt ?? 0)
      )
      setDirectRooms(sorted.filter((r) => r.chatType === 'DIRECT'))
      setGroupRooms(sorted.filter((r) => r.chatType !== 'DIRECT'))
    } catch (e) {
      console.error('채팅 목록 조회 실패', e)
    }
  }, [])

  useEffect(() => {
    fetchRooms()
  }, [fetchRooms])

  // 앱 전체에서 구독 유지 — 채팅방 진입 시에도 끊기지 않음
  useEffect(() => {
    const user = getSavedUser()
    if (!user?.userId) return

    const client = new Client({
      brokerURL: WS_URL,
      reconnectDelay: 5000,
      connectHeaders: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
      onConnect: () => {
        client.subscribe(`/queue/notifications/${user.userId}`, (frame) => {
          const event = JSON.parse(frame.body)
          const { chatRoomId, lastMessage, lastMessageAt, unreadCount } = event
          setDirectRooms((prev) => moveToTop(prev, chatRoomId, lastMessage, lastMessageAt, unreadCount))
          setGroupRooms((prev) => moveToTop(prev, chatRoomId, lastMessage, lastMessageAt, unreadCount))
        })
      },
      onStompError: (frame) => console.error('[WS Notifications] STOMP 에러:', frame.headers?.message),
      onWebSocketError: (event) => console.error('[WS Notifications] WebSocket 에러:', event),
    })

    client.activate()
    return () => client.deactivate()
  }, [])

  return (
    <ChatRoomsContext.Provider value={{ directRooms, setDirectRooms, groupRooms, setGroupRooms, fetchRooms }}>
      {children}
    </ChatRoomsContext.Provider>
  )
}

const moveToTop = (prev, chatRoomId, lastMessage, lastMessageAt, unreadCount) => {
  const updated = prev.map((room) =>
    room.chatRoomId === chatRoomId ? { ...room, lastMessage, lastMessageAt, unreadCount } : room
  )
  const idx = updated.findIndex((r) => r.chatRoomId === chatRoomId)
  if (idx <= 0) return updated
  const [moved] = updated.splice(idx, 1)
  return [moved, ...updated]
}

export const useChatRooms = () => useContext(ChatRoomsContext)
