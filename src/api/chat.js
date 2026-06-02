import axios from 'axios'
import { request } from './client'
import { getAccessToken } from './token'

// 1:1 채팅방 생성/재입장
export const createDirectChat = async (targetUserId) => {
    const response = await request('/api/chats', {
        method: 'POST',
        auth: true,
        data: { targetUserId },
    })
    return response.result
}

// 채팅방 목록 조회
export const getChatRooms = async () => {
    const response = await request('/api/chats', {
        method: 'GET',
        auth: true,
    })
    return response.result
}

// 채팅방 메세지 조회
export const getChatMessages = async (chatRoomId) => {
    const response = await request(`/api/chats/${chatRoomId}/messages`, {
        method: 'GET',
        auth: true,
    })
    return response.result
}

// 채팅 메세지 읽음 처리
export const markChatAsRead = async (chatRoomId, lastReadMessageId) => {
    const response = await request(`/api/chats/${chatRoomId}/read`, {
        method: 'PATCH',
        auth: true,
        data: { lastReadMessageId },
    })
    return response.result
}

// 공통 과목 조회
export const commonCourses = async (chatRoomId) => {
    const response = await request(`/api/chats/${chatRoomId}/common-courses`, {
        method: 'GET',
        auth: true,
    })
    return response.result
}

// 팀원 요청 보내기
export const teamRequest = async (chatRoomId, courseId) => {
    const response = await request(`/api/chats/${chatRoomId}/team-requests`, {
        method: 'POST',
        auth: true,
        data: { courseId },
    })
    return response.result
}

// 채팅방 나가기
export const leaveChatRoom = async (chatRoomId) => {
    const response = await request(`/api/chats/${chatRoomId}/leave`, {
        method: 'PATCH',
        auth: true,
    })
    return response.result
}

// 팀원 요청 최신 상태 조회
export const getLatestTeamRequest = async (chatRoomId) => {
    const response = await request(`/api/chats/${chatRoomId}/team-requests/latest`, {
        method: 'GET',
        auth: true,
    })
    console.log('[TeamRequest API] 전체 응답:', response)
    return response.result
}

// 팀원 요청 수락
export const acceptTeamRequest = async (chatRoomId, teamRequestId) => {
    const response = await request(`/api/chats/${chatRoomId}/team-requests/${teamRequestId}`, {
        method: 'PATCH',
        auth: true,
        data: { status: 'ACCEPTED' },
    })
    return response.result
}

// 채팅방 파일 업로드
export const uploadFile = async (files) => {
    const formData = new FormData()
    files.forEach((file) => formData.append('files', file))
    const token = getAccessToken()
    const response = await axios.post('/api/chats/files', formData, {
        headers: { Authorization: `Bearer ${token}` },
    })
    return response.data.result
}