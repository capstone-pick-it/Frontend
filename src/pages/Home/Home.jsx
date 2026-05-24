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
  createProjectChecklist,
  deleteChecklist,
  getProjectChecklists,
  leaveProject,
  updateChecklist,
  updateChecklistStatus,
} from '../../api/home'

const tabs = [
  { key: 'recruiting', label: '모집 중' },
  { key: 'active', label: '진행 중' },
  { key: 'done', label: '진행 완료' },
]

const currentUserName = '이승희'
const currentUserId = 2

const capstoneTeammates = [
  {
    userId: 1,
    name: '문채이',
    school: '컴퓨터공학과 4학년',
    tags: ['빠른소통', '꼼꼼함', '비대면선호'],
    level: 'LV.2',
    point: '140p',
    priority: '보통',
  },
  {
    userId: 2,
    name: '이승희',
    school: '컴퓨터공학과 4학년',
    tags: ['미리준비', '완벽주의', '대면선호'],
    level: 'LV.1',
    point: '100p',
    priority: '높음',
  },
  {
    userId: 3,
    name: '김성연',
    school: '컴퓨터공학과 4학년',
    tags: ['적극참여', '자료조사', '대면선호'],
    level: 'LV.3',
    point: '220p',
    priority: '높음',
  },
  {
    userId: 4,
    name: '이은우',
    school: '컴퓨터공학과 4학년',
    tags: ['자료조사', '꼼꼼함', '비대면선호'],
    level: 'LV.2',
    point: '130p',
    priority: '보통',
  },
  {
    userId: 5,
    name: '김지희',
    school: '컴퓨터공학과 4학년',
    tags: ['일정관리', '빠른소통', '대면선호'],
    level: 'LV.2',
    point: '150p',
    priority: '높음',
  },
  {
    userId: 6,
    name: '김예린',
    school: '컴퓨터공학과 4학년',
    tags: ['디자인', '꼼꼼함', '완벽주의'],
    level: 'LV.3',
    point: '210p',
    priority: '높음',
  },
  {
    userId: 7,
    name: '김채원',
    school: '컴퓨터공학과 4학년',
    tags: ['일정관리', '디자인', '빠른소통'],
    level: 'LV.2',
    point: '160p',
    priority: '보통',
  },
]

const recruitingProjects = [
  {
    id: 1,
    title: '알고리즘',
    members: '김성연 이승희 문채이',
    status: '모집 중',
    action: '확정 대기',
  },
  {
    id: 2,
    title: '서버구축시스템실습',
    members: '이승희 김성연',
    status: '모집 중',
    action: '팀 확정',
  },
]

const checklist = [
  { id: 1, title: '기획 및 디자인 완료', date: '2026년 3월 30일 월요일', dueAt: '2026-03-30', assignee: '이승희', done: false },
  { id: 2, title: '프론트엔드 완료', date: '2026년 4월 10일 수요일', dueAt: '2026-04-10', assignee: '김성연', done: false },
  { id: 3, title: '백엔드 완료', date: '2026년 5월 1일 목요일', dueAt: '2026-05-01', assignee: '김채원', done: false },
  { id: 4, title: '팀원 모집 완료', date: '2026년 3월 10일 금요일', dueAt: '2026-03-10', assignee: '이승희', done: true },
]

const activeProjects = [
  {
    id: 1,
    title: '알고리즘',
    members: '이승희 문채이',
    status: '진행 중',
    progress: 45,
    teammates: [
      {
        userId: 2,
        name: '이승희',
        school: '컴퓨터공학과 4학년',
        tags: ['미리준비', '완벽주의', '대면선호'],
        level: 'LV.1',
        point: '100p',
        priority: '높음',
      },
      {
        userId: 1,
        name: '문채이',
        school: '컴퓨터공학과 4학년',
        tags: ['빠른소통', '꼼꼼함', '비대면선호'],
        level: 'LV.2',
        point: '140p',
        priority: '보통',
      },
    ],
    checklist: [
      { id: 101, title: '기획 및 디자인 완료', date: '2026년 3월 30일 월요일', dueAt: '2026-03-30', assignee: '이승희', done: false },
      { id: 102, title: '프론트엔드 완료', date: '2026년 4월 10일 수요일', dueAt: '2026-04-10', assignee: '문채이', done: false },
      { id: 103, title: '백엔드 완료', date: '2026년 5월 1일 목요일', dueAt: '2026-05-01', assignee: '이승희', done: false },
      { id: 104, title: '팀원 모집 완료', date: '2026년 3월 10일 금요일', dueAt: '2026-03-10', assignee: '문채이', done: true },
      { id: 105, title: '중간 발표 준비', date: '2026년 5월 8일 금요일', dueAt: '2026-05-08', assignee: '문채이', done: false },
      { id: 106, title: '최종 발표 자료 제작', date: '2026년 6월 2일 화요일', dueAt: '2026-06-02', assignee: '이승희', done: false },
    ],
  },
  {
    id: 2,
    title: '캡스톤 디자인',
    members: '문채이 이승희 김성연 이은우 김지희 김예린 김채원',
    status: '진행 중',
    progress: 72,
    teammates: capstoneTeammates,
    checklist,
  },
]

const completedProjects = [
  {
    id: 201,
    title: '캡스톤 디자인',
    members: '문채이 이승희 김성연 이은우 김지희 김예린 김채원',
    status: '진행 완료',
    progress: 100,
    teammates: capstoneTeammates,
    checklist: [
      { id: 2011, title: '기획 및 디자인 완료', date: '2026년 3월 30일 월요일', dueAt: '2026-03-30', assignee: '이승희', done: true },
      { id: 2012, title: '프론트엔드 완료', date: '2026년 4월 10일 수요일', dueAt: '2026-04-10', assignee: '문채이', done: true },
      { id: 2013, title: '백엔드 완료', date: '2026년 5월 1일 목요일', dueAt: '2026-05-01', assignee: '김성연', done: true },
      { id: 2014, title: '팀원 모집 완료', date: '2026년 3월 10일 금요일', dueAt: '2026-03-10', assignee: '이승희', done: true },
    ],
  },
]

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
  assignee: item.manager?.nickname || item.assignee || currentUserName,
  assigneeId: item.manager?.userId ?? item.managerId ?? item.assigneeId,
  done: item.status ? item.status === 'DONE' : Boolean(item.done),
})

const Home = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [activeTab, setActiveTab] = useState('recruiting')
  const [modal, setModal] = useState(null)
  const [showTeamConfirm, setShowTeamConfirm] = useState(false)
  const [recruitingItems, setRecruitingItems] = useState(recruitingProjects)
  const [activeItems, setActiveItems] = useState(activeProjects)
  const [doneItems, setDoneItems] = useState(completedProjects)
  const [exitTarget, setExitTarget] = useState(null)
  const [reviewProject, setReviewProject] = useState(null)
  const [reviewIndex, setReviewIndex] = useState(0)
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
    setExitTarget({ projectId: project.id, tabKey })
    setModal('exit')
  }

  const completeExit = async () => {
    if (!exitTarget) {
      setModal(null)
      return
    }

    try {
      await leaveProject(exitTarget.projectId)
    } catch (error) {
      console.warn('프로젝트 나가기 실패:', error.message)
    }

    if (exitTarget.tabKey === 'recruiting') {
      setRecruitingItems((items) => items.filter((project) => project.id !== exitTarget.projectId))
      setShowTeamConfirm(false)
    }

    if (exitTarget.tabKey === 'active') {
      setActiveItems((items) => items.filter((project) => project.id !== exitTarget.projectId))
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
  const reviewTeammates = reviewProject?.teammates?.filter((member) => member.name !== currentUserName) || []
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

  useEffect(() => {
    if (!isDetailPage || currentTab !== 'active' || !selectedProject) {
      return
    }

    let ignore = false

    const fetchChecklists = async () => {
      try {
        const response = await getProjectChecklists(selectedProject.id)
        const nextChecklist = (response.result?.checklists || []).map(normalizeChecklistItem)

        if (!ignore) {
          updateProjectChecklist(nextChecklist)
          setChecklistPage(0)
        }
      } catch (error) {
        console.warn('체크리스트 목록 조회 실패:', error.message)
      }
    }

    fetchChecklists()

    return () => {
      ignore = true
    }
  }, [isDetailPage, currentTab, selectedProject?.id])

  const getManagerId = (assigneeName) => {
    return selectedProject?.teammates?.find((member) => member.name === assigneeName)?.userId || currentUserId
  }

  const addChecklistItem = async () => {
    if (!selectedProject) {
      return
    }

    const assignee = selectedProject.teammates.find((member) => member.name === currentUserName)?.name
      || selectedProject.teammates[0]?.name
      || currentUserName
    const managerId = getManagerId(assignee)
    const todayDate = getTodayDateValue()

    try {
      const response = await createProjectChecklist(selectedProject.id, {
        title: '새로운 할 일',
        dueDate: todayDate,
        managerId,
      })
      const nextItem = normalizeChecklistItem(response.result)
      const nextChecklist = [...(selectedProject?.checklist || []), nextItem]

      updateProjectChecklist(nextChecklist)
      setChecklistPage(Math.floor(sortChecklist(nextChecklist).findIndex((item) => item.id === nextItem.id) / 4))
      setEditingChecklistId(nextItem.id)
      return
    } catch (error) {
      console.warn('체크리스트 생성 실패:', error.message)
    }

    checklistIdRef.current += 1
    const nextItem = {
      id: checklistIdRef.current,
      title: '새로운 할 일',
      date: formatDueDate(todayDate),
      dueAt: todayDate,
      assignee,
      assigneeId: managerId,
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

  const finishProject = () => {
    if (!selectedProject) {
      return
    }

    setReviewProject({
      ...selectedProject,
      status: '진행 완료',
      progress: 100,
    })
    setReviewIndex(0)
    setModal('review')
  }

  const completeProjectAfterReview = () => {
    if (!reviewProject) {
      setModal(null)
      return
    }

    setActiveItems((items) => items.filter((project) => project.id !== reviewProject.id))
    setDoneItems((items) => [reviewProject, ...items])
    setActiveTab('done')
    setMemberIndex(0)
    setChecklistPage(0)
    setEditingChecklistId(null)
    setReviewProject(null)
    setReviewIndex(0)
    setModal(null)
    navigate('/home')
  }

  const handleReviewNext = () => {
    if (reviewIndex < reviewTeammates.length - 1) {
      setReviewIndex((index) => index + 1)
      return
    }

    completeProjectAfterReview()
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
                onConfirm={() => setShowTeamConfirm(true)}
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
            <button type="button" onClick={() => setShowTeamConfirm(false)}>아니오</button>
            <button type="button" onClick={() => setShowTeamConfirm(false)}>팀 확정하기</button>
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
                <MemberCard member={selectedMember} onChatClick={() => navigate('/chat')} />
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
                  disabled={currentTab !== 'active' || item.assignee !== currentUserName}
                  aria-label={
                    item.assignee === currentUserName
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

              <button className="home-exit-button" type="button" onClick={finishProject}>
                팀 프로젝트 종료하기
              </button>
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
          onClose={completeExit}
          onConfirm={completeExit}
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
          onConfirm={() => setModal('team-confirm-guide')}
        />
      )}

      {editingChecklistItem && (
        <ChecklistEditModal
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
          onPrev={() => setReviewIndex((index) => Math.max(0, index - 1))}
          onNext={handleReviewNext}
        />
      )}
    </main>
  )
}

export default Home
