import React, { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Nav from '../../components/Nav'
import TopBar from '../../components/TopBar'
import ChecklistEditModal from '../../components/Home/ChecklistEditModal'
import ConfirmModal from '../../components/Home/ConfirmModal'
import DoorIcon from '../../components/Home/DoorIcon'
import HomeProjectCard from '../../components/Home/HomeProjectCard'
import MemberCard from '../../components/Home/MemberCard'
import ReviewModal from '../../components/Home/ReviewModal'
import {
  confirmTeamMembers,
  createCompletionRequest,
  createPeerReview,
  createProjectChecklist,
  decideCompletionRequest,
  deleteChecklist,
  forceLeaveTeam,
  getCurrentCompletionRequest,
  getPeerReviewStatus,
  getPeerReviewTargets,
  getProjectChecklists,
  getProjectDetail,
  getProjectMembers,
  getProjects,
  leaveTeamBeforeConfirm,
  requestTeamLeave,
  updateChecklist,
  updateChecklistStatus,
} from '../../api/Home/home'
import {
  mapTraitNames,
  normalizeTraitName,
  toDisplayImportance,
} from '../../constants/commonOptions'

const tabs = [
  { key: 'recruiting', label: '모집 중' },
  { key: 'active', label: '진행 중' },
  { key: 'done', label: '진행 완료' },
]

const demoCurrentUserName = '이승희'
const getDisplayImportance = (...importanceValues) => {
  const importance = importanceValues.find((value) => value)

  return toDisplayImportance(importance)
}

const getDisplayTraits = (traits, fallbackTraits = []) => {
  const mappedTraits = mapTraitNames(Array.isArray(traits) ? traits : [])

  if (mappedTraits.length > 0) {
    return mappedTraits
  }

  return fallbackTraits.map((trait) => normalizeTraitName(trait)).filter(Boolean)
}

const projectStatusLabel = {
  RECRUITING: '모집 중',
  IN_PROGRESS: '진행 중',
  DONE: '진행 완료',
}

const teamConfirmAction = {
  ready: '팀 확정',
  pending: '확정대기',
}

const sortChecklist = (items) => {
  return [...items].sort((a, b) => {
    if (a.done !== b.done) {
      return a.done ? 1 : -1
    }

    return new Date(a.dueAt) - new Date(b.dueAt)
  })
}

const formatDueDate = (dueDate) => {
  const date = new Date(dueDate)

  if (!dueDate || Number.isNaN(date.getTime())) {
    return '0000년 0월 00일 0요일'
  }

  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  }).format(date)
}

const getTodayDateValue = () => {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

const normalizeChecklistItem = (item) => ({
  id: item.checklistItemId ?? item.id,
  title: item.title,
  date: formatDueDate(item.dueDate ?? item.dueAt),
  dueAt: item.dueDate ?? item.dueAt ?? '9999-12-31',
  assignee: item.manager?.nickname || item.assignee || '',
  assigneeId: item.manager?.userId ?? item.managerId ?? item.assigneeId,
  creatorName: item.createdBy?.nickname || item.creatorName || item.assignee || '',
  creatorId: item.createdBy?.userId ?? item.creatorId,
  done: item.status ? item.status === 'DONE' : Boolean(item.done),
})

const normalizeProjectMember = (member, fallbackMember = {}) => ({
  ...fallbackMember,
  userId: member.userId ?? fallbackMember.userId,
  projectTeamMemberId: member.projectTeamMemberId,
  name: member.nickname || fallbackMember.name || '팀원',
  school: member.major || fallbackMember.school || '',
  role: member.role,
  activeMember: member.activeMember,
  tags: getDisplayTraits(member.traits || member.defaultTraits, fallbackMember.tags || []),
  level: fallbackMember.level || 'LV.1',
  point: fallbackMember.point || '0p',
  priority: getDisplayImportance(member.importance, member.priority, fallbackMember.priority),
})

const normalizeProjectDetail = (detail, fallbackProject) => {
  if (!detail) {
    return fallbackProject
  }

  return {
    ...fallbackProject,
    id: detail.projectTeamId ?? fallbackProject.id,
    title: detail.courseName || fallbackProject.title,
    status: detail.status === 'DONE' ? '진행 완료' : fallbackProject.status,
    progress: Math.round(detail.progressRate ?? fallbackProject.progress ?? 0),
  }
}

const normalizeProjectSummary = (project, fallbackStatus) => {
  const status = project.projectStatus || project.status || fallbackStatus
  const memberNames = project.memberNames || project.members || []
  const title = project.projectName || project.courseName || project.title || '프로젝트'

  return {
    id: project.projectTeamId ?? project.projectId ?? project.id,
    title,
    members: Array.isArray(memberNames) ? memberNames.join(' ') : memberNames,
    status: projectStatusLabel[status] || project.status || projectStatusLabel[fallbackStatus] || '진행 중',
    action: project.action || (status === 'RECRUITING' ? teamConfirmAction.ready : ''),
    progress: Math.round(project.progressRate ?? project.progress ?? (status === 'DONE' ? 100 : 0)),
    teammates: Array.isArray(memberNames)
      ? memberNames.map((name, index) => ({
        userId: project.memberIds?.[index] ?? index + 1,
        name,
        school: '',
        tags: getDisplayTraits(project.traits || project.defaultTraits),
        level: 'LV.1',
        point: '0p',
        priority: getDisplayImportance(project.importance, project.priority),
      }))
      : [],
    checklist: [],
  }
}

const normalizeCompletionRequest = (request) => {
  if (!request) {
    return null
  }

  return {
    id: request.completionRequestId ?? request.id,
    projectTeamId: request.projectTeamId,
    status: request.status || 'PENDING',
    requester: request.requester,
    approvals: request.approvals || [],
  }
}

const getApprovedUserIds = (request) => {
  return new Set(
    (request?.approvals || [])
      .filter((approval) => approval.decision === 'APPROVE')
      .map((approval) => approval.user?.userId)
      .filter(Boolean),
  )
}

const getReviewProgress = (status, fallbackTotal = 0) => {
  const members = status?.members || []
  const completedCount = members.filter((member) => member.completed).length

  return {
    completedCount,
    totalCount: members.length || fallbackTotal,
  }
}

const isPeerReviewCompleted = (status) => {
  const members = status?.members || []

  return members.length > 0 && members.every((member) => member.completed)
}

const Home = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [activeTab, setActiveTab] = useState('recruiting')
  const [modal, setModal] = useState(null)
  const [showTeamConfirm, setShowTeamConfirm] = useState(false)
  const [recruitingItems, setRecruitingItems] = useState([])
  const [activeItems, setActiveItems] = useState([])
  const [doneItems, setDoneItems] = useState([])
  const [exitTarget, setExitTarget] = useState(null)
  const [teamConfirmTarget, setTeamConfirmTarget] = useState(null)
  const [reviewProject, setReviewProject] = useState(null)
  const [reviewIndex, setReviewIndex] = useState(0)
  const [reviewTargets, setReviewTargets] = useState([])
  const [completionRequests, setCompletionRequests] = useState({})
  const [peerReviewStatuses, setPeerReviewStatuses] = useState({})
  const [memberIndex, setMemberIndex] = useState(0)
  const [checklistPage, setChecklistPage] = useState(0)
  const [editingChecklistId, setEditingChecklistId] = useState(null)
  const checklistIdRef = useRef(1000)

  const projectsByTab = {
    recruiting: recruitingItems,
    active: activeItems,
    done: doneItems,
  }
  const [detailTab, detailProjectId] = location.pathname.replace(/^\/home\/?/, '').split('/').filter(Boolean)
  const isDetailPage = Boolean(projectsByTab[detailTab] && detailProjectId)
  const currentTab = isDetailPage ? detailTab : activeTab
  const selectedProject = isDetailPage
    ? projectsByTab[currentTab].find((project) => String(project.id) === detailProjectId)
    : null

  const handleTabClick = (tabKey) => {
    setActiveTab(tabKey)
    setShowTeamConfirm(false)
    setModal(null)
    setExitTarget(null)
    setMemberIndex(0)
    setChecklistPage(0)
    setEditingChecklistId(null)
    navigate('/home')
  }

  const openProjectDetail = (project) => {
    setMemberIndex(0)
    setChecklistPage(0)
    setEditingChecklistId(null)
    navigate(`/home/${activeTab}/${project.id}`)
  }

  const closeProjectDetail = () => {
    if (isDetailPage) {
      setActiveTab(currentTab)
    }

    setModal(null)
    setExitTarget(null)
    setMemberIndex(0)
    setChecklistPage(0)
    setEditingChecklistId(null)
    navigate('/home')
  }

  const openExitModal = (project, tabKey = currentTab) => {
    const shouldRequestLeave = tabKey !== 'recruiting' || project.action !== teamConfirmAction.ready

    setExitTarget({
      projectId: project.id,
      tabKey,
      shouldRequestLeave,
    })
    setModal('exit')
  }

  const openTeamConfirm = (project) => {
    setTeamConfirmTarget(project)
    setShowTeamConfirm(true)
  }

  const confirmRecruitingTeam = async () => {
    if (!teamConfirmTarget) {
      setShowTeamConfirm(false)
      return
    }

    let shouldMoveToActive = false

    try {
      const response = await confirmTeamMembers(teamConfirmTarget.id)
      const result = response.result

      shouldMoveToActive = result?.allConfirmed || result?.projectTeamStatus === 'IN_PROGRESS'
    } catch (error) {
      console.warn('팀원 확정 실패:', error.message)
    } finally {
      if (shouldMoveToActive) {
        const nextActiveProject = {
          ...teamConfirmTarget,
          action: '',
          status: projectStatusLabel.IN_PROGRESS,
          progress: teamConfirmTarget.progress ?? 0,
          teammates: teamConfirmTarget.teammates || [],
          checklist: teamConfirmTarget.checklist || [],
        }

        setRecruitingItems((items) => items.filter((project) => project.id !== teamConfirmTarget.id))
        setActiveItems((items) => (
          items.some((project) => project.id === teamConfirmTarget.id)
            ? items
            : [nextActiveProject, ...items]
        ))
      } else {
        setRecruitingItems((items) => (
          items.map((project) => (
            project.id === teamConfirmTarget.id
              ? { ...project, action: teamConfirmAction.pending }
              : project
          ))
        ))
      }

      setTeamConfirmTarget(null)
      setShowTeamConfirm(false)
    }
  }

  const completeExit = async (agreed) => {
    if (!exitTarget) {
      setModal(null)
      return
    }

    try {
      if (!exitTarget.shouldRequestLeave) {
        await leaveTeamBeforeConfirm(exitTarget.projectId)
      } else if (agreed) {
        await requestTeamLeave(exitTarget.projectId)
      } else {
        await forceLeaveTeam(exitTarget.projectId)
      }
    } catch (error) {
      console.warn('프로젝트 나가기 실패:', error.message)
    }

    if (exitTarget.tabKey === 'recruiting' && !exitTarget.shouldRequestLeave) {
      setRecruitingItems((items) => items.filter((project) => project.id !== exitTarget.projectId))
      setShowTeamConfirm(false)
    }

    if (exitTarget.tabKey === 'recruiting' && exitTarget.shouldRequestLeave && !agreed) {
      setRecruitingItems((items) => items.filter((project) => project.id !== exitTarget.projectId))
      setShowTeamConfirm(false)
    }

    if (exitTarget.tabKey === 'active') {
      if (!agreed) {
        setActiveItems((items) => items.filter((project) => project.id !== exitTarget.projectId))
      }
      setActiveTab('active')
      navigate('/home')
    }

    setExitTarget(null)
    setMemberIndex(0)
    setChecklistPage(0)
    setEditingChecklistId(null)
    setModal(null)
  }

  const selectedMember = selectedProject?.teammates?.[memberIndex]
  const checklistItems = sortChecklist(selectedProject?.checklist || [])
  const checklistPages = Math.max(1, Math.ceil(checklistItems.length / 4))
  const visibleChecklist = checklistItems.slice(checklistPage * 4, checklistPage * 4 + 4)
  const editingChecklistItem = checklistItems.find((item) => item.id === editingChecklistId)
  const currentProjectUser = selectedProject?.teammates?.find((member) => member.name === demoCurrentUserName)
    || reviewProject?.teammates?.find((member) => member.name === demoCurrentUserName)
    || selectedProject?.teammates?.[0]
    || reviewProject?.teammates?.[0]
  const currentProjectUserName = currentProjectUser?.name || ''
  const currentProjectUserId = currentProjectUser?.userId
  const isChecklistAssignee = (item) => {
    if (item.assigneeId && currentProjectUserId) {
      return item.assigneeId === currentProjectUserId
    }

    return item.assignee === currentProjectUserName
  }
  const completionRequest = selectedProject ? completionRequests[selectedProject.id] : null
  const approvedUserIds = getApprovedUserIds(completionRequest)
  const currentUserCompletionDecision = (completionRequest?.approvals || [])
    .find((approval) => approval.user?.userId === currentProjectUserId)?.decision
  const completionApproved = completionRequest?.status === 'APPROVED'
    || (selectedProject && approvedUserIds.size >= selectedProject.teammates.length)
  const peerReviewStatus = selectedProject ? peerReviewStatuses[selectedProject.id] : null
  const reviewProgress = getReviewProgress(peerReviewStatus, selectedProject?.teammates?.length || 0)
  const currentUserReviewDone = (peerReviewStatus?.members || [])
    .some((member) => member.userId === currentProjectUserId && member.completed)
  const reviewTeammates = reviewTargets.length > 0
    ? reviewTargets
    : reviewProject?.teammates?.filter((member) => member.name !== currentProjectUserName) || []
  const reviewTeammate = reviewTeammates[reviewIndex]

  const updateProjectChecklist = (nextChecklist) => {
    if (!selectedProject) {
      return
    }

    setActiveItems((items) => (
      items.map((project) => (
        project.id === selectedProject.id
          ? { ...project, checklist: nextChecklist }
          : project
      ))
    ))
  }

  const updateProjectDetail = (nextProject) => {
    const updateItems = (items) => (
      items.map((project) => (
        project.id === nextProject.id ? nextProject : project
      ))
    )

    if (currentTab === 'done') {
      setDoneItems(updateItems)
      return
    }

    setActiveItems(updateItems)
  }

  useEffect(() => {
    let ignore = false

    const fetchProjects = async () => {
      try {
        const [recruitingResponse, activeResponse, doneResponse] = await Promise.all([
          getProjects('RECRUITING'),
          getProjects('IN_PROGRESS'),
          getProjects('DONE'),
        ])

        if (ignore) {
          return
        }

        setRecruitingItems((recruitingResponse.result || []).map((project) => (
          normalizeProjectSummary(project, 'RECRUITING')
        )))
        setActiveItems((activeResponse.result || []).map((project) => (
          normalizeProjectSummary(project, 'IN_PROGRESS')
        )))
        setDoneItems((doneResponse.result || []).map((project) => (
          normalizeProjectSummary(project, 'DONE')
        )))
      } catch (error) {
        console.warn('프로젝트 목록 조회 실패:', error.message)
      }
    }

    fetchProjects()

    return () => {
      ignore = true
    }
  }, [])

  useEffect(() => {
    if (activeItems.length === 0) {
      return
    }

    let ignore = false

    const fetchPeerReviewStatuses = async () => {
      const completedProjects = []

      await Promise.all(activeItems.map(async (project) => {
        try {
          const response = await getPeerReviewStatus(project.id)
          const nextStatus = response.result

          if (ignore || !nextStatus) {
            return
          }

          setPeerReviewStatuses((statuses) => ({
            ...statuses,
            [project.id]: nextStatus,
          }))

          if (isPeerReviewCompleted(nextStatus)) {
            completedProjects.push({
              ...project,
              status: '진행 완료',
              progress: 100,
            })
          }
        } catch (error) {
          console.warn('프로젝트 평가 진행 상황 조회 실패:', error.message)
        }
      }))

      if (!ignore && completedProjects.length > 0) {
        const completedIds = new Set(completedProjects.map((project) => project.id))
        setActiveItems((items) => items.filter((project) => !completedIds.has(project.id)))
        setDoneItems((items) => [
          ...completedProjects.filter((project) => !items.some((item) => item.id === project.id)),
          ...items,
        ])
      }
    }

    fetchPeerReviewStatuses()

    return () => {
      ignore = true
    }
  }, [activeItems.map((project) => project.id).join(',')])

  useEffect(() => {
    if (!isDetailPage || !selectedProject || currentTab === 'recruiting') {
      return
    }

    let ignore = false

    const fetchProjectInterior = async () => {
      try {
        const [detailResponse, membersResponse, checklistsResponse] = await Promise.all([
          getProjectDetail(selectedProject.id),
          getProjectMembers(selectedProject.id),
          getProjectChecklists(selectedProject.id),
        ])
        const detail = detailResponse.result
        const members = membersResponse.result?.members || []
        const checklists = checklistsResponse.result?.checklists || []
        const nextTeammates = members.map((member) => {
          const fallbackMember = selectedProject.teammates?.find((teammate) => teammate.userId === member.userId)

          return normalizeProjectMember(member, fallbackMember)
        })
        const nextProject = {
          ...normalizeProjectDetail(detail, selectedProject),
          teammates: nextTeammates.length > 0 ? nextTeammates : selectedProject.teammates,
          members: nextTeammates.length > 0
            ? nextTeammates.map((member) => member.name).join(' ')
            : selectedProject.members,
          checklist: checklists.length > 0
            ? checklists.map(normalizeChecklistItem)
            : selectedProject.checklist,
        }

        if (!ignore) {
          updateProjectDetail(nextProject)
          setChecklistPage(0)
        }
      } catch (error) {
        console.warn('프로젝트 내부 상세 정보 조회 실패:', error.message)
      }
    }

    fetchProjectInterior()

    return () => {
      ignore = true
    }
  }, [isDetailPage, currentTab, selectedProject?.id])

  useEffect(() => {
    if (!isDetailPage || currentTab !== 'active' || !selectedProject) {
      return
    }

    let ignore = false

    const fetchCompletionState = async () => {
      try {
        const response = await getCurrentCompletionRequest(selectedProject.id)
        const nextRequest = normalizeCompletionRequest(response.result)

        if (!ignore && nextRequest) {
          setCompletionRequests((requests) => ({
            ...requests,
            [selectedProject.id]: nextRequest,
          }))
        }
      } catch (error) {
        console.warn('프로젝트 종료 요청 조회 실패:', error.message)
      }

      try {
        const response = await getPeerReviewStatus(selectedProject.id)

        if (!ignore && response.result) {
          setPeerReviewStatuses((statuses) => ({
            ...statuses,
            [selectedProject.id]: response.result,
          }))
        }
      } catch (error) {
        console.warn('프로젝트 평가 진행 상황 조회 실패:', error.message)
      }
    }

    fetchCompletionState()

    return () => {
      ignore = true
    }
  }, [isDetailPage, currentTab, selectedProject?.id])

  const getManagerId = (assigneeName) => {
    return selectedProject?.teammates?.find((member) => member.name === assigneeName)?.userId || currentProjectUserId
  }

  const addChecklistItem = async () => {
    if (!selectedProject) {
      return
    }

    const assignee = selectedProject.teammates[0]?.name || ''
    const managerId = getManagerId(assignee)
    const todayDate = getTodayDateValue()
    checklistIdRef.current += 1
    const nextItem = {
      id: checklistIdRef.current,
      title: '새로운 할 일',
      date: formatDueDate(todayDate),
      dueAt: todayDate,
      assignee,
      assigneeId: managerId,
      creatorName: currentProjectUserName,
      creatorId: currentProjectUserId,
      done: false,
      isNew: true,
    }
    const nextChecklist = [...(selectedProject?.checklist || []), nextItem]
    updateProjectChecklist(nextChecklist)
    setChecklistPage(Math.floor(sortChecklist(nextChecklist).findIndex((item) => item.id === nextItem.id) / 4))
    setEditingChecklistId(nextItem.id)
  }

  const saveChecklistItem = async (nextItem) => {
    const managerId = getManagerId(nextItem.assignee)

    if (nextItem.isNew) {
      try {
        const response = await createProjectChecklist(selectedProject.id, {
          title: nextItem.title,
          dueDate: nextItem.dueAt,
          managerId,
        })
        const savedItem = normalizeChecklistItem(response.result)

        updateProjectChecklist((selectedProject?.checklist || []).map((item) => (
          item.id === nextItem.id ? savedItem : item
        )))
      } catch (error) {
        console.warn('체크리스트 생성 실패:', error.message)
        updateProjectChecklist((selectedProject?.checklist || []).map((item) => (
          item.id === nextItem.id ? { ...nextItem, assigneeId: managerId } : item
        )))
      } finally {
        setEditingChecklistId(null)
      }

      return
    }

    try {
      const response = await updateChecklist(nextItem.id, {
        title: nextItem.title,
        dueDate: nextItem.dueAt,
      })
      const savedItem = normalizeChecklistItem(response.result)

      updateProjectChecklist((selectedProject?.checklist || []).map((item) => (
        item.id === nextItem.id ? { ...nextItem, ...savedItem, assignee: nextItem.assignee, assigneeId: managerId } : item
      )))
    } catch (error) {
      console.warn('체크리스트 수정 실패:', error.message)
      updateProjectChecklist((selectedProject?.checklist || []).map((item) => (
        item.id === nextItem.id ? { ...nextItem, assigneeId: managerId } : item
      )))
    } finally {
      setEditingChecklistId(null)
    }
  }

  const deleteChecklistItem = async (itemId) => {
    if (!selectedProject) {
      return
    }

    try {
      await deleteChecklist(itemId)
    } catch (error) {
      console.warn('체크리스트 삭제 실패:', error.message)
    }

    updateProjectChecklist((selectedProject?.checklist || []).filter((item) => item.id !== itemId))
    setEditingChecklistId(null)
  }

  const toggleChecklistItem = async (itemId) => {
    if (!selectedProject) {
      return
    }

    const targetItem = selectedProject.checklist.find((item) => item.id === itemId)

    if (!targetItem || !isChecklistAssignee(targetItem)) {
      return
    }

    const nextDone = !targetItem?.done

    try {
      await updateChecklistStatus(itemId, {
        status: nextDone ? 'DONE' : 'TODO',
      })
    } catch (error) {
      console.warn('체크리스트 완료 상태 변경 실패:', error.message)
    }

    const nextChecklist = (selectedProject?.checklist || []).map((item) => (
      item.id === itemId ? { ...item, done: nextDone } : item
    ))
    updateProjectChecklist(nextChecklist)
    const nextIndex = sortChecklist(nextChecklist).findIndex((item) => item.id === itemId)
    setChecklistPage(Math.max(0, Math.floor(nextIndex / 4)))
  }

  const createFallbackCompletionRequest = (project) => ({
    id: Date.now(),
    projectTeamId: project.id,
    status: 'PENDING',
    requester: {
      userId: currentProjectUserId,
      nickname: currentProjectUserName,
    },
    approvals: [],
  })

  const createFallbackApprovals = (decision) => {
    const currentApproval = {
      completionApprovalId: Date.now() + currentProjectUserId,
      user: {
        userId: currentProjectUserId,
        nickname: currentProjectUserName,
      },
      decision,
    }
    const nextApprovals = (completionRequest.approvals || [])
      .filter((approval) => approval.user?.userId !== currentProjectUserId)

    return [...nextApprovals, currentApproval]
  }

  const requestProjectCompletion = async () => {
    if (!selectedProject) {
      return
    }

    try {
      const response = await createCompletionRequest(selectedProject.id)
      const nextRequest = normalizeCompletionRequest(response.result)

      setCompletionRequests((requests) => ({
        ...requests,
        [selectedProject.id]: nextRequest || createFallbackCompletionRequest(selectedProject),
      }))
    } catch (error) {
      console.warn('프로젝트 종료 요청 생성 실패:', error.message)
      setCompletionRequests((requests) => ({
        ...requests,
        [selectedProject.id]: createFallbackCompletionRequest(selectedProject),
      }))
    } finally {
      setModal(null)
    }
  }

  const decideProjectCompletion = async (decision) => {
    if (!selectedProject || !completionRequest?.id) {
      return
    }

    try {
      const response = await decideCompletionRequest(completionRequest.id, { decision })
      const nextRequest = normalizeCompletionRequest(response.result)

      setCompletionRequests((requests) => ({
        ...requests,
        [selectedProject.id]: nextRequest || completionRequest,
      }))
    } catch (error) {
      console.warn('프로젝트 종료 요청 응답 실패:', error.message)
      const nextApprovals = createFallbackApprovals(decision)
      const approvedCount = nextApprovals.filter((approval) => approval.decision === 'APPROVE').length
      const isApprovedByAll = approvedCount >= selectedProject.teammates.length

      setCompletionRequests((requests) => ({
        ...requests,
        [selectedProject.id]: {
          ...completionRequest,
          approvals: nextApprovals,
          status: isApprovedByAll ? 'APPROVED' : 'PENDING',
        },
      }))
    }
  }

  const startPeerReview = async () => {
    if (!selectedProject) {
      return
    }

    try {
      const response = await getPeerReviewTargets(selectedProject.id)
      const nextTargets = (response.result?.targets || [])
        .filter((target) => !target.reviewed)
        .map((target) => ({
          userId: target.userId,
          name: target.nickname,
          school: target.major || '',
          reviewed: target.reviewed,
        }))

      setReviewTargets(nextTargets)
    } catch (error) {
      console.warn('평가 대상 목록 조회 실패:', error.message)
      setReviewTargets(selectedProject.teammates.filter((member) => member.name !== currentProjectUserName))
    }

    setReviewProject({
      ...selectedProject,
      status: '진행 완료',
      progress: 100,
    })
    setReviewIndex(0)
    setModal('review')
  }

  const completeProjectAfterReview = (project = reviewProject) => {
    if (!project) {
      setModal(null)
      return
    }

    setActiveItems((items) => items.filter((item) => item.id !== project.id))
    setDoneItems((items) => [project, ...items])
    setActiveTab('done')
    setMemberIndex(0)
    setChecklistPage(0)
    setEditingChecklistId(null)
    setReviewProject(null)
    setReviewIndex(0)
    setModal(null)
    navigate('/home')
  }

  const handleReviewNext = async (scores) => {
    if (!reviewProject || !reviewTeammate) {
      setModal(null)
      return
    }

    try {
      await createPeerReview(reviewProject.id, {
        revieweeUserId: reviewTeammate.userId,
        completionScore: scores.completionScore,
        proactivityScore: scores.proactivityScore,
        satisfactionScore: scores.satisfactionScore,
      })
    } catch (error) {
      console.warn('팀원 평가 등록 실패:', error.message)
    }

    if (reviewIndex < reviewTeammates.length - 1) {
      setReviewIndex((index) => index + 1)
      return
    }

    try {
      const response = await getPeerReviewStatus(reviewProject.id)
      const nextStatus = response.result
      const progress = getReviewProgress(nextStatus, reviewProject.teammates.length)

      setPeerReviewStatuses((statuses) => ({
        ...statuses,
        [reviewProject.id]: nextStatus,
      }))

      if (progress.totalCount > 0 && progress.completedCount >= progress.totalCount) {
        completeProjectAfterReview(reviewProject)
        return
      }
    } catch (error) {
      console.warn('프로젝트 평가 진행 상황 조회 실패:', error.message)
      setPeerReviewStatuses((statuses) => ({
        ...statuses,
        [reviewProject.id]: {
          projectTeamId: reviewProject.id,
          members: reviewProject.teammates.map((member) => ({
            userId: member.userId,
            nickname: member.name,
            completed: true,
          })),
        },
      }))
      completeProjectAfterReview(reviewProject)
      return
    }

    setReviewProject(null)
    setReviewTargets([])
    setReviewIndex(0)
    setModal(null)
  }

  return (
    <main className="container has-topbar home-page">
      <TopBar
        title={isDetailPage ? selectedProject?.title || '프로젝트' : '나의 팀 프로젝트'}
        variant={isDetailPage ? 'back' : 'default'}
        onBack={closeProjectDetail}
      />

      {!isDetailPage && (
        <>
          <nav className="home-tabs">
            {tabs.map((tab) => (
              <button
                className={activeTab === tab.key ? 'is-active' : ''}
                type="button"
                key={tab.key}
                onClick={() => handleTabClick(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          <section className="home-project-list">
            {projectsByTab[activeTab].map((project) => (
              <HomeProjectCard
                project={project}
                tab={activeTab}
                key={project.id}
                onConfirm={() => openTeamConfirm(project)}
                onExit={() => openExitModal(project, activeTab)}
                onOpen={activeTab !== 'recruiting' ? () => openProjectDetail(project) : undefined}
              />
            ))}
          </section>
        </>
      )}

      {!isDetailPage && activeTab === 'recruiting' && showTeamConfirm && (
        <section className="home-inline-confirm">
          <h2>팀을 이대로 확정하시겠습니까?</h2>
          <p>
            팀 확정 요청은 취소가 불가하며,<br />
            모든 팀원에게 요청이 전송됩니다.<br />
            채팅을 통해 충분히 의논을 마치셨는지<br />
            확인 후 진행을 권장드립니다
          </p>
          <div>
            <button type="button" onClick={() => {
              setTeamConfirmTarget(null)
              setShowTeamConfirm(false)
            }}>
              아니오
            </button>
            <button type="button" onClick={confirmRecruitingTeam}>팀 확정하기</button>
          </div>
        </section>
      )}

      {isDetailPage && selectedProject && (
        <section className="home-detail">
          {selectedMember && (
            <>
              <div className="home-member-carousel">
                <button
                  type="button"
                  onClick={() => setMemberIndex((memberIndex - 1 + selectedProject.teammates.length) % selectedProject.teammates.length)}
                >
                  이전 팀원
                </button>
                <MemberCard
                  currentIndex={memberIndex + 1}
                  member={selectedMember}
                  totalCount={selectedProject.teammates.length}
                  onChatClick={() => navigate('/chat')}
                />
                <button
                  type="button"
                  onClick={() => setMemberIndex((memberIndex + 1) % selectedProject.teammates.length)}
                >
                  다음 팀원
                </button>
              </div>
              <div className="home-carousel-dots">
                {selectedProject.teammates.map((member, index) => (
                  <button
                    className={index === memberIndex ? 'is-active' : ''}
                    type="button"
                    key={member.name}
                    aria-label={`${index + 1}번째 팀원 보기`}
                    onClick={() => setMemberIndex(index)}
                  />
                ))}
              </div>
            </>
          )}

          <header className="home-checklist-header">
            <h2>체크리스트</h2>
            {currentTab === 'active' && <button type="button" onClick={addChecklistItem}>+</button>}
          </header>

          <div className="home-checklist">
            {visibleChecklist.map((item) => (
              <article className={item.done ? 'is-done' : ''} key={item.id}>
                <button type="button" onClick={() => currentTab === 'active' && setEditingChecklistId(item.id)}>
                  <div className="home-checklist__title-row">
                    <h3>{item.title}</h3>
                    <span>{item.assignee}</span>
                  </div>
                  <p>{item.date}</p>
                </button>
                <button
                  type="button"
                  disabled={currentTab !== 'active' || !isChecklistAssignee(item)}
                  aria-label={
                    isChecklistAssignee(item)
                      ? '체크리스트 완료 상태 변경'
                      : `${item.assignee} 담당 할 일입니다`
                  }
                  onClick={() => toggleChecklistItem(item.id)}
                >
                  {item.done ? '✓' : ''}
                </button>
              </article>
            ))}
          </div>

          <div className="home-checklist-pager">
            <button
              type="button"
              onClick={() => setChecklistPage((checklistPage - 1 + checklistPages) % checklistPages)}
            >
              이전 체크리스트
            </button>
            <div className="home-carousel-dots home-carousel-dots--checklist">
              {Array.from({ length: checklistPages }).map((_, index) => (
                <button
                  className={index === checklistPage ? 'is-active' : ''}
                  type="button"
                  key={index}
                  aria-label={`${index + 1}번째 체크리스트 묶음 보기`}
                  onClick={() => setChecklistPage(index)}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => setChecklistPage((checklistPage + 1) % checklistPages)}
            >
              다음 체크리스트
            </button>
          </div>

          {currentTab === 'active' && (
            <>
              <button className="home-exit-icon-button" type="button" onClick={() => openExitModal(selectedProject, currentTab)}>
                <DoorIcon />
              </button>

              {!completionRequest && (
                <button className="home-exit-button" type="button" onClick={() => setModal('completion-request')}>
                  팀 프로젝트 종료하기
                </button>
              )}

              {completionRequest && !currentUserReviewDone && (
                <>
                  <section className="home-completion-card">
                    {completionApproved ? (
                      <em>모든 팀원이 종료에 동의했습니다</em>
                    ) : currentUserCompletionDecision === 'APPROVE' ? (
                      <em>팀 프로젝트 종료에 동의하셨습니다</em>
                    ) : (
                      <>
                        <strong>팀 프로젝트를 종료하시겠습니까?</strong>
                        <button type="button" onClick={() => decideProjectCompletion('APPROVE')}>동의</button>
                      </>
                    )}
                    <div>
                      {selectedProject.teammates.map((member) => (
                        <span className={approvedUserIds.has(member.userId) ? 'is-approved' : ''} key={member.userId}>
                          {member.name}
                        </span>
                      ))}
                    </div>
                  </section>

                  {completionApproved && (
                    <button className="home-exit-button" type="button" onClick={startPeerReview}>
                      팀원 평가 시작하기
                    </button>
                  )}
                </>
              )}

              {completionApproved && currentUserReviewDone && (
                <p className="home-review-progress">
                  팀원 평가 완료 {reviewProgress.completedCount}/{reviewProgress.totalCount}
                </p>
              )}
            </>
          )}
        </section>
      )}

      <Nav />

      {modal === 'team-confirm-guide' && (
        <ConfirmModal
          title="팀원과 논의된 사항인가요?"
          description={'미리 사정을 이야기하셨다면 네 를,\n아무 말도 없으셨다면 아니오 를 눌러주세요.\n아니오를 고를 시 무단 탈주로 간주되며,\n포인트를 돌려받으실 수 없습니다.'}
          cancelText="아니오"
          confirmText="네"
          onCancel={() => completeExit(false)}
          onConfirm={() => completeExit(true)}
        />
      )}

      {modal === 'exit' && (
        <ConfirmModal
          title="팀을 나가시겠습니까?"
          cancelText="아니오"
          confirmText="네"
          onClose={() => {
            setExitTarget(null)
            setModal(null)
          }}
          onConfirm={() => {
            if (exitTarget?.shouldRequestLeave) {
              setModal('team-confirm-guide')
              return
            }

            completeExit(false)
          }}
        />
      )}

      {modal === 'completion-request' && (
        <ConfirmModal
          title="팀 프로젝트 종료 요청을 보내시겠습니까?"
          cancelText="취소"
          confirmText="보내기"
          onClose={() => setModal(null)}
          onConfirm={requestProjectCompletion}
        />
      )}

      {editingChecklistItem && (
        <ChecklistEditModal
          canEdit={editingChecklistItem.isNew || isChecklistAssignee(editingChecklistItem)}
          item={editingChecklistItem}
          members={selectedProject?.teammates || []}
          onClose={() => setEditingChecklistId(null)}
          onDelete={deleteChecklistItem}
          onSave={saveChecklistItem}
        />
      )}

      {modal === 'review' && reviewTeammate && (
        <ReviewModal
          teammate={reviewTeammate}
          currentIndex={reviewIndex}
          totalCount={reviewTeammates.length}
          onNext={handleReviewNext}
        />
      )}
    </main>
  )
}

export default Home
