import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Nav from '../../components/Nav';
import TopBar from '../../components/TopBar';
import ProfileCard from '../../components/ProfileCard';
import DefaultTraits from '../../components/MyPage/DefaultTraits';
import CourseCard from '../../components/MyPage/CourseCard';
import ProjectHistorySummary from '../../components/MyPage/ProjectHistorySummary';

import {
  USER_INFO,
  USER_DEFAULT_TRAITS,
  COURSE_INFO,
  PROJECT_HISTORY_SUMMARY,
} from '../../data/mockData';

const MyPage = () => {
  const navigate = useNavigate();

  // 초기값 mockData로 설정
  const [userInfo, setUserInfo] = useState(USER_INFO);
  const [traits, setTraits] = useState(USER_DEFAULT_TRAITS);
  const [courses, setCourses] = useState(COURSE_INFO);
  const [projectHistorySummary, setProjectHistorySummary] = useState(PROJECT_HISTORY_SUMMARY);

  // API 연동 예정
  useEffect(() => {
    // 추후 실제 로직 구현
  }, []);

  return (
    <div className="container has-topbar mypage-container">
      {/* 페이지 타이틀 */}
      <TopBar title="마이페이지" />

      <div className="mypage-content">
        {/* 회원 정보 카드 */}
        <div className="section-profile">
          <ProfileCard
            name={userInfo.name}
            major={userInfo.major}
            year={userInfo.year}
            level={userInfo.level}
            points={userInfo.points}
            enableStatModal
          />
        </div>

        {/* 기본 팀플 성향 */}
        <div className="section-default-traits">
          <DefaultTraits
            traits={traits}
            onEdit={() => navigate('/mypage/traits/edit')}
          />
        </div>

        {/* 강의 정보 카드 */}
        <div className="section-course-card">
          <CourseCard
            courses={courses}
            onEdit={() => navigate('/mypage/courses')}
          />
        </div>

        {/* 프로젝트 이력 */}
        <div className="section-project-history-summary">
          <ProjectHistorySummary
            summary={projectHistorySummary}
            onDetail={() => navigate('/mypage/project-history')}
          />
        </div>
      </div>

      {/* 하단 네비게이션 바 */}
      <Nav />
    </div>
  );
};

export default MyPage;