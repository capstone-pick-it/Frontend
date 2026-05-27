import { request } from './client'

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