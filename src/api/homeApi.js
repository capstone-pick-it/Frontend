import { apiClient } from './httpClient'

export const homeApi = {
  getProjects: () => apiClient.get('/projects/me'),
  getProjectDetail: (projectId) => apiClient.get(`/projects/${projectId}`),
  createChecklistItem: (projectId, payload) => apiClient.post(`/projects/${projectId}/checklists`, payload),
  updateChecklistItem: (projectId, checklistId, payload) => (
    apiClient.patch(`/projects/${projectId}/checklists/${checklistId}`, payload)
  ),
  toggleChecklistItem: (projectId, checklistId, done) => (
    apiClient.patch(`/projects/${projectId}/checklists/${checklistId}/status`, { done })
  ),
  finishProject: (projectId) => apiClient.post(`/projects/${projectId}/finish`),
}
