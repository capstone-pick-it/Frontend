import { useEffect, useState } from 'react'
import { Client } from '@stomp/stompjs'
import { getAccessToken } from '../api/token'

const WS_URL = import.meta.env.DEV
  ? 'ws://localhost:5173/ws-chat'
  : `wss://${import.meta.env.VITE_API_BASE_URL.replace('https://', '').replace('http://', '')}/ws-chat`

const useChatNotifications = () => {
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    const client = new Client({
      brokerURL: WS_URL,
      reconnectDelay: 5000,
      connectHeaders: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
      onConnect: () => {
        console.log('[WS Notifications] 연결 성공')
        client.subscribe('/user/queue/notifications', (frame) => {
          console.log('[WS Notifications] 알림 수신:', frame.body)
          const event = JSON.parse(frame.body)
          setNotification(event)
        })
      },
      onDisconnect: () => console.log('[WS Notifications] 연결 해제'),
      onStompError: (frame) => console.error('[WS Notifications] STOMP 에러:', frame.headers?.message),
      onWebSocketError: (event) => console.error('[WS Notifications] WebSocket 에러:', event),
    })

    client.activate()
    return () => client.deactivate()
  }, [])

  return { notification }
}

export default useChatNotifications
