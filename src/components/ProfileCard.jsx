import React from 'react';
import StatBox from './StatBox';

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
            <StatBox 
                label="팀플레벨" 
                value={`LV.${level}`} 
            />

            {/* 포인트 */}
            <StatBox 
                label="포인트" 
                value={`${points}p`} 
            />

        </div>

    </div>
  );
};

export default ProfileCard;