import React from 'react';
import '../assets/sass/components/_profileCard.scss';

// 이름, 전공, 학년, 레벨, 포인트 데이터속성 받아오기
const ProfileCard = ({ name, major, year, level, points }) => {
  return (
    <div className="profile-card">
      {/* 1. 상단: 회원정보 */}
      <div className="profile-info">
        {/* 이름 텍스트 필드 */}
        <h2 className="user-name">{name}</h2>
        {/* 학과 & 학년 텍스트 필드 */}
        <p className="user-major">{major} {year}학년</p>
      </div>

      {/* 2. 하단: 스탯 박스 (팀플레벨, 포인트) */}
      <div className="profile-stats">
        {/* 팀플레벨 */}
        <div className="stat-box">
          <span className="stat-label">팀플레벨</span>
          <span className="stat-value">LV.{level}</span>
        </div>
        {/* 포인트 박스 (팀플레벨과 같은 디자인이므로 클래스명 재사용) */}
        <div className="stat-box">
          <span className="stat-label">포인트</span>
          <span className="stat-value">{points}p</span>
        </div>
        
      </div>
    </div>
  );
};

export default ProfileCard;