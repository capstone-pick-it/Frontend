import React from 'react'

const MemberCard = ({ currentIndex, member, onChatClick, totalCount }) => {
  return (
    <section className="home-member-card">
      <div className="home-member-card__top">
        <div>
          <h2>{member.name}</h2>
          <p>{member.school}</p>
        </div>
        <span>{currentIndex}/{totalCount}</span>
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

export default MemberCard
