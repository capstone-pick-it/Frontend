import { request } from './client'
import {
  createChecklistRequestBody,
  updateChecklistRequestBody,
  updateChecklistStatusRequestBody,
} from './home.dto'

export const getProjectChecklists = (projectTeamId) => {
  return request(`/projects/${projectTeamId}/checklists`, {
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

export const leaveProject = (projectTeamId) => {
  return request(`/projects/${projectTeamId}/leave`, {
    method: 'POST',
    requireAuth: true,
  })
}
