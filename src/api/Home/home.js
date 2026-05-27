import { request } from '../client'
import {
  completionDecisionRequestBody,
  createChecklistRequestBody,
  peerReviewRequestBody,
  updateChecklistRequestBody,
  updateChecklistStatusRequestBody,
} from './home.dto'

export const getProjects = (status) => {
  return request('/api/projects', {
    method: 'GET',
    requireAuth: true,
    params: status ? { status } : undefined,
  })
}

export const getProjectChecklists = (projectTeamId) => {
  return request(`/api/projects/${projectTeamId}/checklists`, {
    method: 'GET',
    requireAuth: true,
  })
}

export const getProjectDetail = (projectTeamId) => {
  return request(`/api/projects/${projectTeamId}`, {
    method: 'GET',
    requireAuth: true,
  })
}

export const getProjectMembers = (projectTeamId) => {
  return request(`/api/projects/${projectTeamId}/members`, {
    method: 'GET',
    requireAuth: true,
  })
}

export const createProjectChecklist = (projectTeamId, { title, dueDate, managerId }) => {
  return request(`/api/projects/${projectTeamId}/checklists`, {
    method: 'POST',
    requireAuth: true,
    body: JSON.stringify(createChecklistRequestBody({ title, dueDate, managerId })),
  })
}

export const updateChecklist = (checklistItemId, { title, dueDate }) => {
  return request(`/api/checklists/${checklistItemId}`, {
    method: 'PATCH',
    requireAuth: true,
    body: JSON.stringify(updateChecklistRequestBody({ title, dueDate })),
  })
}

export const updateChecklistStatus = (checklistItemId, { status }) => {
  return request(`/api/checklists/${checklistItemId}/status`, {
    method: 'PATCH',
    requireAuth: true,
    body: JSON.stringify(updateChecklistStatusRequestBody({ status })),
  })
}

export const deleteChecklist = (checklistItemId) => {
  return request(`/api/checklists/${checklistItemId}`, {
    method: 'DELETE',
    requireAuth: true,
  })
}

export const confirmTeamMembers = (projectTeamId) => {
  return request(`/api/teams/${projectTeamId}/confirm`, {
    method: 'PATCH',
    requireAuth: true,
  })
}

export const leaveTeamBeforeConfirm = (projectTeamId) => {
  return request(`/api/teams/${projectTeamId}/leave`, {
    method: 'DELETE',
    requireAuth: true,
  })
}

export const requestTeamLeave = (projectTeamId) => {
  return request(`/api/teams/${projectTeamId}/leave/request`, {
    method: 'POST',
    requireAuth: true,
  })
}

export const getTeamLeaveRequest = (projectTeamId) => {
  return request(`/api/teams/${projectTeamId}/leave/request`, {
    method: 'GET',
    requireAuth: true,
  })
}

export const approveTeamLeave = (projectTeamId) => {
  return request(`/api/teams/${projectTeamId}/leave/approve`, {
    method: 'POST',
    requireAuth: true,
  })
}

export const forceLeaveTeam = (projectTeamId) => {
  return request(`/api/teams/${projectTeamId}/leave/force`, {
    method: 'DELETE',
    requireAuth: true,
  })
}

export const createCompletionRequest = (projectTeamId) => {
  return request(`/projects/${projectTeamId}/completion-requests`, {
    method: 'POST',
    requireAuth: true,
  })
}

export const getCurrentCompletionRequest = (projectTeamId) => {
  return request(`/projects/${projectTeamId}/completion-requests/current`, {
    method: 'GET',
    requireAuth: true,
  })
}

export const decideCompletionRequest = (completionRequestId, { decision }) => {
  return request(`/completion-requests/${completionRequestId}/decisions`, {
    method: 'POST',
    requireAuth: true,
    body: JSON.stringify(completionDecisionRequestBody({ decision })),
  })
}

export const getPeerReviewTargets = (projectTeamId) => {
  return request(`/api/projects/${projectTeamId}/peer-reviews/targets`, {
    method: 'GET',
    requireAuth: true,
  })
}

export const createPeerReview = (projectTeamId, {
  revieweeUserId,
  completionScore,
  proactivityScore,
  satisfactionScore,
}) => {
  return request(`/api/projects/${projectTeamId}/peer-reviews`, {
    method: 'POST',
    requireAuth: true,
    body: JSON.stringify(peerReviewRequestBody({
      revieweeUserId,
      completionScore,
      proactivityScore,
      satisfactionScore,
    })),
  })
}

export const getPeerReviewStatus = (projectTeamId) => {
  return request(`/api/projects/${projectTeamId}/peer-reviews/status`, {
    method: 'GET',
    requireAuth: true,
  })
}
