import { useEffect, useRef, useState } from 'react'
import { Client } from '@stomp/stompjs'
import { getAccessToken } from '../api/token'

const WS_URL = import.meta.env.DEV
  ? 'ws://localhost:5173/ws-chat'
  : `wss://${import.meta.env.VITE_API_BASE_URL.replace('https://', '').replace('http://', '')}/ws-chat`

const useChatSocket = (chatRoomId) => {
  const [messages, setMessages] = useState([])
  const [teamRequestEvent, setTeamRequestEvent] = useState(null)
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
        console.log('[WS] 연결 성공')
        client.subscribe(`/topic/chatrooms/${chatRoomId}`, (frame) => {
          console.log('[WS] 이벤트 수신:', frame.body)
          const event = JSON.parse(frame.body)

          if (event.eventType === 'CHAT_MESSAGE_CREATED' && event.message) {
            const msg = {
              ...event.message,
              senderId: event.message.sender.userId,
              senderNickname: event.message.sender.nickname,
            }
            setMessages((prev) => [...prev, msg])
          } else if (
            event.eventType === 'TEAM_REQUEST_CREATED' ||
            event.eventType === 'TEAM_REQUEST_ACCEPTED' ||
            event.eventType === 'TEAM_REQUEST_REJECTED'
          ) {
            setTeamRequestEvent({ type: event.eventType, ...event.teamRequest })
          }
        })
      },
      onDisconnect: () => console.log('[WS] 연결 해제'),
      onStompError: (frame) => console.error('[WS] STOMP 에러:', frame.headers?.message, frame),
      onWebSocketError: (event) => console.error('[WS] WebSocket 에러:', event),
      onWebSocketClose: (event) => console.error('[WS] WebSocket 닫힘 - 코드:', event.code, '이유:', event.reason),
    })

    client.activate()
    clientRef.current = client

    return () => client.deactivate()
  }, [chatRoomId])

  const sendMessage = (content) => {
    if (!clientRef.current?.connected) {
      console.error('[WS] 연결되지 않음 - 메시지 전송 불가')
      return
    }
    console.log('[WS] 메시지 전송:', { chatRoomId: Number(chatRoomId), messageType: 'TEXT', content })
    clientRef.current.publish({
      destination: '/app/chat.send',
      body: JSON.stringify({ chatRoomId: Number(chatRoomId), messageType: 'TEXT', content }),
    })
  }

  return { messages, sendMessage, teamRequestEvent }
}

export default useChatSocket
