export const createChecklistRequestBody = ({ title, dueDate, managerId }) => ({
  title,
  dueDate,
  managerId,
})

export const updateChecklistRequestBody = ({ title, dueDate }) => ({
  title,
  dueDate,
})

export const updateChecklistStatusRequestBody = ({ status }) => ({
  status,
})

export const leaveProjectRequestBody = ({ agreed }) => ({
  agreed,
})

export const completionDecisionRequestBody = ({ decision }) => ({
  decision,
})

export const peerReviewRequestBody = ({
  revieweeUserId,
  completionScore,
  proactivityScore,
  satisfactionScore,
}) => ({
  revieweeUserId,
  completionScore,
  proactivityScore,
  satisfactionScore,
})
