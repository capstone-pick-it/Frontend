import React, { useState } from 'react'

const scoreItems = [
  { key: 'completionScore', label: '완수율' },
  { key: 'proactivityScore', label: '적극성' },
  { key: 'satisfactionScore', label: '팀원만족도' },
]

const ReviewModal = ({ teammate, currentIndex, totalCount, onNext }) => {
  const [scores, setScores] = useState({
    completionScore: 0,
    proactivityScore: 0,
    satisfactionScore: 0,
  })
  const [showConfirm, setShowConfirm] = useState(false)
  const isLastReview = currentIndex === totalCount - 1
  const isComplete = Object.values(scores).every((score) => score > 0)

  const selectScore = (key, value) => {
    setScores((prevScores) => ({
      ...prevScores,
      [key]: value,
    }))
  }

  return (
    <div className="home-modal-backdrop">
      <section className="home-review-modal">
        {showConfirm ? (
          <>
            <h2>이대로 평가를 완료하시겠습니까?</h2>
            <p>팀원 평가는 수정할 수 없습니다.</p>
            <div className="home-review-modal__confirm">
              <button type="button" onClick={() => setShowConfirm(false)}>아니오</button>
              <button type="button" onClick={() => onNext(scores)}>네</button>
            </div>
          </>
        ) : (
          <>
            <h2>{teammate.name} 님과의 프로젝트는 어떠셨나요?</h2>
            <p>팀 프로젝트 어떠셨나요?</p>

            <div className="home-review-modal__scores">
              {scoreItems.map((score) => (
                <div className="home-review-row" key={score.key}>
                  <strong>{score.label}</strong>
                  <div>
                    {[1, 2, 3, 4, 5].map((item) => (
                      <button
                        className={item <= scores[score.key] ? 'is-active' : ''}
                        type="button"
                        key={item}
                        aria-label={`${score.label} ${item}점`}
                        onClick={() => selectScore(score.key, item)}
                      >
                        ✓
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="home-review-modal__buttons">
              <span>{currentIndex + 1}/{totalCount}</span>
              <button type="button" disabled={!isComplete} onClick={() => setShowConfirm(true)}>
                {isLastReview ? '완료' : '다음'}
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  )
}

export default ReviewModal
