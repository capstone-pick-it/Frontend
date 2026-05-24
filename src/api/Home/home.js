import { request } from '../client'
import {
  completionDecisionRequestBody,
  createChecklistRequestBody,
  leaveProjectRequestBody,
  peerReviewRequestBody,
  updateChecklistRequestBody,
  updateChecklistStatusRequestBody,
} from './home.dto'

export const getProjectChecklists = (projectTeamId) => {
  return request(`/projects/${projectTeamId}/checklists`, {
    method: 'GET',
    requireAuth: true,
  })
}

export const getProjectDetail = (projectTeamId) => {
  return request(`/projects/${projectTeamId}`, {
    method: 'GET',
    requireAuth: true,
  })
}

export const getProjectMembers = (projectTeamId) => {
  return request(`/projects/${projectTeamId}/members`, {
    method: 'GET',
    requireAuth: true,
  })
}

export const createProjectChecklist = (projectTeamId, { title, dueDate, managerId }) => {
  return request(`/projects/${projectTeamId}/checklists`, {
    method: 'POST',
    requireAuth: true,
    body: JSON.stringify(createChecklistRequestBody({ title, dueDate, managerId })),
  })
}

export const updateChecklist = (checklistItemId, { title, dueDate }) => {
  return request(`/checklists/${checklistItemId}`, {
    method: 'PATCH',
    requireAuth: true,
    body: JSON.stringify(updateChecklistRequestBody({ title, dueDate })),
  })
}

export const updateChecklistStatus = (checklistItemId, { status }) => {
  return request(`/checklists/${checklistItemId}/status`, {
    method: 'PATCH',
    requireAuth: true,
    body: JSON.stringify(updateChecklistStatusRequestBody({ status })),
  })
}

export const deleteChecklist = (checklistItemId) => {
  return request(`/checklists/${checklistItemId}`, {
    method: 'DELETE',
    requireAuth: true,
  })
}

export const leaveProject = (projectTeamId, { agreed }) => {
  return request(`/projects/${projectTeamId}/leave`, {
    method: 'POST',
    requireAuth: true,
    body: JSON.stringify(leaveProjectRequestBody({ agreed })),
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
  return request(`/projects/${projectTeamId}/peer-reviews/targets`, {
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
  return request(`/projects/${projectTeamId}/peer-reviews`, {
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
  return request(`/projects/${projectTeamId}/peer-reviews/status`, {
    method: 'GET',
    requireAuth: true,
  })
}
