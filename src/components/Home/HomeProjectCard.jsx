import React from 'react'
import DoorIcon from './DoorIcon'

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

export default HomeProjectCard
