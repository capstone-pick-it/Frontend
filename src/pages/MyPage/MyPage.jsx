import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Nav from '../../components/Nav';
import TopBar from '../../components/TopBar';
import ProfileCard from '../../components/ProfileCard';
import DefaultTraits from '../../components/MyPage/DefaultTraits';
import CourseCard from '../../components/MyPage/CourseCard';
import ProjectHistorySummary from '../../components/MyPage/ProjectHistorySummary';

import { getSavedUser } from '../../api/token';
import {
  getCourseCards,
  getDefaultTraits,
  getMyPoints,
  getMyProfile,
  getMyTeamLevel,
  getProjectHistorySummary,
  mapCourseCard,
  mapDefaultTraits,
  mapProfile,
  mapProjectHistorySummary,
  sortCoursesByCourseNameAsc,
} from '../../api/mypage';

const getInitialUserInfo = () => {
  const savedUser = getSavedUser();

  return {
    name: savedUser?.nickname || '',
    major: '',
    year: '',
    level: 0,
    points: 0,
  };
};

const INITIAL_PROJECT_HISTORY_SUMMARY = {
  projectCount: 0,
  completionRate: 0,
  averagePeerReview: 0,
  maxPeerReviewScore: 5,
};

const MyPage = () => {
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState(getInitialUserInfo);
  const [traits, setTraits] = useState([]);
  const [courses, setCourses] = useState([]);
  const [projectHistorySummary, setProjectHistorySummary] = useState(INITIAL_PROJECT_HISTORY_SUMMARY);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadMyPage = async () => {
      const [
        profileResult,
        teamLevelResult,
        pointsResult,
        traitsResult,
        courseCardsResult,
        projectHistorySummaryResult,
      ] = await Promise.allSettled([
        getMyProfile(),
        getMyTeamLevel(),
        getMyPoints(),
        getDefaultTraits(),
        getCourseCards(),
        getProjectHistorySummary(),
      ]);

      if (!isMounted) return;

      if (profileResult.status === 'fulfilled') {
        setUserInfo((prev) => ({
          ...prev,
          ...mapProfile(profileResult.value.result),
        }));
      } else {
        console.log('[마이페이지 사용자 정보 조회 실패]', profileResult.reason.message);
      }

      if (teamLevelResult.status === 'fulfilled') {
        const teamLevel = teamLevelResult.value.result;
        setUserInfo((prev) => ({
          ...prev,
          level: teamLevel?.teamLevel ?? teamLevel?.level ?? prev.level,
        }));
      } else {
        console.log('[팀플 레벨 조회 실패]', teamLevelResult.reason.message);
      }

      if (pointsResult.status === 'fulfilled') {
        setUserInfo((prev) => ({
          ...prev,
          points: pointsResult.value.result?.balance ?? prev.points,
        }));
      } else {
        console.log('[포인트 조회 실패]', pointsResult.reason.message);
      }

      if (traitsResult.status === 'fulfilled') {
        setTraits(mapDefaultTraits(traitsResult.value.result));
      } else {
        console.log('[기본 성향 조회 실패]', traitsResult.reason.message);
      }

      if (courseCardsResult.status === 'fulfilled') {
        setCourses(
          sortCoursesByCourseNameAsc((courseCardsResult.value.result || []).map(mapCourseCard))
        );
      } else {
        console.log('[강의 카드 조회 실패]', courseCardsResult.reason.message);
      }

      if (projectHistorySummaryResult.status === 'fulfilled') {
        setProjectHistorySummary(
          mapProjectHistorySummary(projectHistorySummaryResult.value.result)
        );
      } else {
        console.log('[프로젝트 이력 요약 조회 실패]', projectHistorySummaryResult.reason.message);
      }

      setIsLoading(false);
    };

    loadMyPage();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="container has-topbar mypage-container">
      {/* 페이지 타이틀 */}
      <TopBar title="마이페이지" />

      <div className="mypage-content">
        {isLoading ? (
          <p className="mypage-loading">마이페이지 정보를 불러오는 중입니다.</p>
        ) : (
          <>
            {/* 회원 정보 카드 */}
            <div className="section-profile">
              <ProfileCard
                name={userInfo.name}
                major={userInfo.major}
                year={userInfo.year}
                level={userInfo.level}
                points={userInfo.points}
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
          </>
        )}
      </div>

      {/* 하단 네비게이션 바 */}
      <Nav />
    </div>
  );
};

export default MyPage;
