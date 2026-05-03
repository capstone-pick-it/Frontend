import React, { useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Nav from '../../components/Nav'

const tabs = [
  { key: 'recruiting', label: '모집 중' },
  { key: 'active', label: '진행 중' },
  { key: 'done', label: '진행 완료' },
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
  { id: 1, title: '기획 및 디자인 완료', date: '2026년 3월 30일 월요일', dueAt: '2026-03-30', done: false },
  { id: 2, title: '프론트엔드 완료', date: '2026년 4월 10일 수요일', dueAt: '2026-04-10', done: false },
  { id: 3, title: '백엔드 완료', date: '2026년 5월 1일 목요일', dueAt: '2026-05-01', done: false },
  { id: 4, title: '팀원 모집 완료', date: '2026년 3월 10일 금요일', dueAt: '2026-03-10', done: true },
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
        name: '이승희',
        school: '컴퓨터공학과 4학년',
        tags: ['미리준비', '완벽주의', '대면선호'],
        level: 'LV.1',
        point: '100p',
        priority: '높음',
      },
      {
        name: '문채이',
        school: '컴퓨터공학과 4학년',
        tags: ['빠른소통', '꼼꼼함', '비대면선호'],
        level: 'LV.2',
        point: '140p',
        priority: '보통',
      },
    ],
    checklist: [
      { id: 101, title: '기획 및 디자인 완료', date: '2026년 3월 30일 월요일', dueAt: '2026-03-30', done: false },
      { id: 102, title: '프론트엔드 완료', date: '2026년 4월 10일 수요일', dueAt: '2026-04-10', done: false },
      { id: 103, title: '백엔드 완료', date: '2026년 5월 1일 목요일', dueAt: '2026-05-01', done: false },
      { id: 104, title: '팀원 모집 완료', date: '2026년 3월 10일 금요일', dueAt: '2026-03-10', done: true },
      { id: 105, title: '중간 발표 준비', date: '2026년 5월 8일 금요일', dueAt: '2026-05-08', done: false },
      { id: 106, title: '최종 발표 자료 제작', date: '2026년 6월 2일 화요일', dueAt: '2026-06-02', done: false },
    ],
  },
  {
    id: 2,
    title: '캡스톤 디자인',
    members: '이승희 김성연 김채원',
    status: '진행 중',
    progress: 72,
    teammates: [
      {
        name: '이승희',
        school: '컴퓨터공학과 4학년',
        tags: ['미리준비', '완벽주의', '대면선호'],
        level: 'LV.1',
        point: '100p',
        priority: '높음',
      },
      {
        name: '김성연',
        school: '컴퓨터공학과 4학년',
        tags: ['적극참여', '자료조사', '대면선호'],
        level: 'LV.3',
        point: '220p',
        priority: '높음',
      },
      {
        name: '김채원',
        school: '컴퓨터공학과 4학년',
        tags: ['일정관리', '디자인', '빠른소통'],
        level: 'LV.2',
        point: '160p',
        priority: '보통',
      },
    ],
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
  },
]

const scores = [
  { label: '완수율', value: 3 },
  { label: '적극성', value: 4 },
  { label: '팀원만족도', value: 2 },
]

const sortChecklist = (items) => {
  return [...items].sort((a, b) => {
    if (a.done !== b.done) {
      return a.done ? 1 : -1
    }

    return new Date(a.dueAt) - new Date(b.dueAt)
  })
}

const getDueAtFromDateText = (dateText) => {
  const [, year, month, day] = dateText.match(/(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일/) || []

  if (!year || !month || !day) {
    return '9999-12-31'
  }

  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
}

const DoorIcon = () => (
  <svg viewBox="0 0 18 18" aria-hidden="true">
    <path d="M6 3.2h5.4v11.6H6z" />
    <path d="M11.4 5.1 15 6.6v6.7l-3.6 1.5z" />
    <path d="M13.1 10h.1" />
  </svg>
)

const HomeProjectCard = ({ project, tab, onConfirm, onExit, onOpen }) => {
  const showConfirm = tab === 'recruiting' && project.action === '팀 확정'

  return (
    <article className={tab !== 'recruiting' ? 'home-project-card is-clickable' : 'home-project-card'} onClick={onOpen}>
      <div className="home-project-card__main">
        <div className="home-project-card__content">
          <div className="home-project-card__title-row">
            <h2>{project.title}</h2>
            <span className="home-project-card__status">{project.status}</span>
            {tab === 'recruiting' && (
              <button
                className="home-project-card__invite"
                type="button"
                onClick={(event) => {
                  event.stopPropagation()
                  onExit()
                }}
              >
                <DoorIcon />
              </button>
            )}
          </div>
          <p>{project.members}</p>
        </div>

        {tab === 'recruiting' && (
          <button
            className={`home-project-card__action ${showConfirm ? 'is-primary' : ''}`}
            type="button"
            onClick={showConfirm ? onConfirm : undefined}
          >
            {project.action}
          </button>
        )}
      </div>

      {tab !== 'recruiting' && (
        <div className="home-project-card__progress">
          <span style={{ width: `${project.progress}%` }} />
        </div>
      )}
    </article>
  )
}

const MemberCard = ({ member, onChatClick }) => {
  return (
    <section className="home-member-card">
      <div className="home-member-card__top">
        <div>
          <h2>{member.name}</h2>
          <p>{member.school}</p>
        </div>
        <span>1/7</span>
      </div>

      <div className="home-member-card__tags">
        {member.tags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>

      <div className="home-member-card__stats">
        <div>
          <p>팀플레벨</p>
          <strong>{member.level}</strong>
        </div>
        <div>
          <p>포인트</p>
          <strong>{member.point}</strong>
        </div>
        <div>
          <p>중요도</p>
          <strong>{member.priority}</strong>
        </div>
      </div>

      <div className="home-member-card__buttons">
        <button type="button" onClick={onChatClick}>채팅하기</button>
        <button type="button">신고하기</button>
      </div>
    </section>
  )
}

const ConfirmModal = ({ title, description, cancelText, confirmText, onClose, onCancel, onConfirm }) => {
  return (
    <div className="home-modal-backdrop">
      <section className="home-confirm-modal">
        <h2>{title}</h2>
        {description && <p>{description}</p>}
        <div>
          <button type="button" onClick={onCancel || onClose}>{cancelText}</button>
          <button type="button" onClick={onConfirm || onClose}>{confirmText}</button>
        </div>
      </section>
    </div>
  )
}

const ReviewModal = ({ onClose }) => {
  return (
    <div className="home-modal-backdrop">
      <section className="home-review-modal">
        <h2>이승희과의 캡스톤 디자인</h2>
        <p>팀 프로젝트 어떠셨나요?</p>

        <div className="home-review-modal__scores">
          {scores.map((score) => (
            <div className="home-review-row" key={score.label}>
              <strong>{score.label}</strong>
              <div>
                {[1, 2, 3, 4, 5].map((item) => (
                  <span className={item <= score.value ? 'is-active' : ''} key={item}>✓</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="home-review-modal__buttons">
          <button type="button" onClick={onClose}>이전</button>
          <span>1/7</span>
          <button type="button" onClick={onClose}>완료</button>
        </div>
      </section>
    </div>
  )
}

const ChecklistEditModal = ({ item, onClose, onSave }) => {
  const [title, setTitle] = useState(item.title)
  const [date, setDate] = useState(item.date)

  return (
    <div className="home-modal-backdrop">
      <section className="home-checklist-modal">
        <h2>할 일 수정</h2>
        <label>
          <span>할 일</span>
          <input value={title} onChange={(event) => setTitle(event.target.value)} />
        </label>
        <label>
          <span>기한</span>
          <input value={date} onChange={(event) => setDate(event.target.value)} />
        </label>
        <div>
          <button type="button" onClick={onClose}>취소</button>
          <button
            type="button"
            onClick={() => onSave({
              ...item,
              title: title.trim() || '새로운 할 일',
              date: date.trim() || '0000년 0월 00일 0요일',
              dueAt: getDueAtFromDateText(date.trim()),
            })}
          >
            저장
          </button>
        </div>
      </section>
    </div>
  )
}

const Home = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [activeTab, setActiveTab] = useState('recruiting')
  const [modal, setModal] = useState(null)
  const [showTeamConfirm, setShowTeamConfirm] = useState(false)
  const [activeItems, setActiveItems] = useState(activeProjects)
  const [doneItems, setDoneItems] = useState(completedProjects)
  const [memberIndex, setMemberIndex] = useState(0)
  const [checklistPage, setChecklistPage] = useState(0)
  const [editingChecklistId, setEditingChecklistId] = useState(null)
  const checklistIdRef = useRef(1000)

  const projectsByTab = {
    recruiting: recruitingProjects,
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
    setMemberIndex(0)
    setChecklistPage(0)
    setEditingChecklistId(null)
    navigate('/home')
  }

  const selectedMember = selectedProject?.teammates?.[memberIndex]
  const checklistItems = sortChecklist(selectedProject?.checklist || [])
  const checklistPages = Math.max(1, Math.ceil(checklistItems.length / 4))
  const visibleChecklist = checklistItems.slice(checklistPage * 4, checklistPage * 4 + 4)
  const editingChecklistItem = checklistItems.find((item) => item.id === editingChecklistId)

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

  const addChecklistItem = () => {
    if (!selectedProject) {
      return
    }

    checklistIdRef.current += 1
    const nextItem = {
      id: checklistIdRef.current,
      title: '새로운 할 일',
      date: '0000년 0월 00일 0요일',
      dueAt: '9999-12-31',
      done: false,
    }
    const nextChecklist = [...(selectedProject?.checklist || []), nextItem]
    updateProjectChecklist(nextChecklist)
    setChecklistPage(Math.floor(sortChecklist(nextChecklist).findIndex((item) => item.id === nextItem.id) / 4))
    setEditingChecklistId(nextItem.id)
  }

  const saveChecklistItem = (nextItem) => {
    updateProjectChecklist((selectedProject?.checklist || []).map((item) => (
      item.id === nextItem.id ? nextItem : item
    )))
    setEditingChecklistId(null)
  }

  const toggleChecklistItem = (itemId) => {
    if (!selectedProject) {
      return
    }

    const nextChecklist = (selectedProject?.checklist || []).map((item) => (
      item.id === itemId ? { ...item, done: !item.done } : item
    ))
    updateProjectChecklist(nextChecklist)
    const nextIndex = sortChecklist(nextChecklist).findIndex((item) => item.id === itemId)
    setChecklistPage(Math.max(0, Math.floor(nextIndex / 4)))
  }

  const finishProject = () => {
    if (!selectedProject) {
      return
    }

    const finishedProject = {
      ...selectedProject,
      status: '진행 완료',
      progress: 100,
    }

    setActiveItems((items) => items.filter((project) => project.id !== selectedProject.id))
    setDoneItems((items) => [finishedProject, ...items])
    setActiveTab('done')
    setMemberIndex(0)
    setChecklistPage(0)
    setEditingChecklistId(null)
    setModal('review')
    navigate(`/home/done/${finishedProject.id}`)
  }

  return (
    <main className="container home-page">
      <header className={isDetailPage ? 'home-page-header is-detail' : 'home-page-header'}>
        {isDetailPage ? (
          <>
            <button type="button" onClick={closeProjectDetail} aria-label="이전으로 돌아가기">
              &lt;
            </button>
            <h1>{selectedProject?.title || '프로젝트'}</h1>
          </>
        ) : (
          <h1>나의 팀 프로젝트</h1>
        )}
      </header>

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
                onExit={() => setModal('exit')}
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
                  <h3>{item.title}</h3>
                  <p>{item.date}</p>
                </button>
                <button
                  type="button"
                  disabled={currentTab !== 'active'}
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
              <button className="home-exit-icon-button" type="button" onClick={() => setModal('exit')}>
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
          onClose={() => setModal(null)}
          onConfirm={() => setModal(null)}
        />
      )}

      {modal === 'exit' && (
        <ConfirmModal
          title="팀을 나가시겠습니까?"
          cancelText="아니오"
          confirmText="네"
          onClose={() => setModal(null)}
          onConfirm={() => setModal('team-confirm-guide')}
        />
      )}

      {editingChecklistItem && (
        <ChecklistEditModal
          item={editingChecklistItem}
          onClose={() => setEditingChecklistId(null)}
          onSave={saveChecklistItem}
        />
      )}

      {modal === 'review' && <ReviewModal onClose={() => setModal(null)} />}
    </main>
  )
}

export default Home
