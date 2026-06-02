import { useEffect, useRef, useState } from 'react'
import { Client } from '@stomp/stompjs'
import { getAccessToken } from '../api/token'

const WS_URL = import.meta.env.DEV
  ? 'ws://localhost:5173/ws-chat'
  : `wss://${import.meta.env.VITE_API_BASE_URL.replace('https://', '').replace('http://', '')}/ws-chat`

const useChatSocket = (chatRoomId) => {
  const [messages, setMessages] = useState([])
  const [teamRequestEvent, setTeamRequestEvent] = useState(null)
  const [readEvent, setReadEvent] = useState(null)
  const clientRef = useRef(null)

  useEffect(() => {
    if (!chatRoomId) return

    const client = new Client({
      brokerURL: WS_URL,
      reconnectDelay: 0,
      connectHeaders: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
      onConnect: () => {
        client.subscribe(`/topic/chatrooms/${chatRoomId}`, (frame) => {
          const event = JSON.parse(frame.body)
          if (event.eventType === 'CHAT_MESSAGE_CREATED' && event.message) {
            const msg = {
              ...event.message,
              senderId: event.message.sender.userId,
              senderNickname: event.message.sender.nickname,
            }
            setMessages((prev) => [...prev, msg])
          } else if (event.eventType === 'CHAT_READ') {
            const lastReadId = event.lastReadMessageId
            setMessages((prev) => prev.map((msg) => {
              const msgId = msg.messageId ?? msg.id ?? msg.chatMessageId
              if (msgId <= lastReadId && (msg.unreadMemberCount ?? 0) > 0) {
                return { ...msg, unreadMemberCount: msg.unreadMemberCount - 1 }
              }
              return msg
            }))
            setReadEvent(event)
          } else if (
            event.eventType === 'TEAM_REQUEST_CREATED' ||
            event.eventType === 'TEAM_REQUEST_ACCEPTED' ||
            event.eventType === 'TEAM_REQUEST_REJECTED'
          ) {
            setTeamRequestEvent({ type: event.eventType, ...event.teamRequest })
          }
        })
      },
      onDisconnect: () => {},
      onStompError: (frame) => console.error('[WS] STOMP 에러:', frame.headers?.message, frame),
      onWebSocketError: (event) => console.error('[WS] WebSocket 에러:', event),
      onWebSocketClose: (event) => console.error('[WS] WebSocket 닫힘 - 코드:', event.code, '이유:', event.reason),
    })

    client.activate()
    clientRef.current = client

    return () => client.deactivate()
  }, [chatRoomId])

  const sendMessage = (content, messageType = 'TEXT', files = []) => {
    if (!clientRef.current?.connected) {
      console.error('[WS] 연결되지 않음 - 메시지 전송 불가 / chatRoomId:', chatRoomId)
      return
    }
    clientRef.current.publish({
      destination: '/app/chat.send',
      body: JSON.stringify({ chatRoomId: Number(chatRoomId), messageType, content, files }),
    })
  }

  const clearMessages = () => setMessages([])

  return { messages, sendMessage, teamRequestEvent, clearMessages, readEvent }
}

export default useChatSocket
