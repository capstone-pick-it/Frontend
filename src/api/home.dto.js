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
