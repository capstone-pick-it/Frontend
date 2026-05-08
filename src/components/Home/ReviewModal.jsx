import React from 'react'

const scores = [
  { label: '완수율', value: 3 },
  { label: '적극성', value: 4 },
  { label: '팀원만족도', value: 2 },
]

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

export default ReviewModal
