import { request } from './client'

export const createDirectChat = async (targetUserId) => {
    const response = await request('/api/chats', {
        method: 'POST',
        auth: true,
        data: { targetUserId },
    })
    return response.result
}

export const getChatRooms = async () => {
    const response = await request('/api/chats', {
        method: 'GET',
        auth: true,
    })
    return response.result
}

export const getChatMessages = async (chatRoomId) => {
    const response = await request(`/api/chats/${chatRoomId}/messages`, {
        method: 'GET',
        auth: true,
    })
    return response.result
}

export const markChatAsRead = async (chatRoomId, lastReadMessageId) => {
    const response = await request(`/api/chats/${chatRoomId}/read`, {
        method: 'PATCH',
        auth: true,
        data: { lastReadMessageId },
    })
    return response.result
}

export const commonCourses = async (chatRoomId) => {
    const response = await request(`/api/chats/${chatRoomId}/common-courses`, {
        method: 'GET',
        auth: true,
    })
    return response.result
}