import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Nav from '../../components/Nav';
import TopBar from '../../components/TopBar';
import ProfileCard from '../../components/ProfileCard';
import Modal from '../../components/Modal';
import DefaultTraits from '../../components/MyPage/DefaultTraits';
import CourseCard from '../../components/MyPage/CourseCard';
import ProjectHistorySummary from '../../components/MyPage/ProjectHistorySummary';

import { deleteUser, logoutUser } from '../../api/auth';
import { clearAuthTokens, getSavedUser } from '../../api/token';
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
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [deleteErrorMessage, setDeleteErrorMessage] = useState('');

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
        const nextTeamLevel =
          typeof teamLevel === 'number'
            ? teamLevel
            : teamLevel?.teamLevel ?? teamLevel?.level;

        setUserInfo((prev) => ({
          ...prev,
          level: nextTeamLevel ?? prev.level,
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
          sortCoursesByCourseNameAsc(
            (courseCardsResult.value.result || []).map((course) => mapCourseCard(course))
          )
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

  const handleConfirmLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      await logoutUser();
    } catch (error) {
      console.log('[로그아웃 실패]', error.message);
    } finally {
      clearAuthTokens();
      setIsLogoutModalOpen(false);
      setIsLoggingOut(false);
      navigate('/login', { replace: true });
    }
  };

  const handleOpenDeleteModal = () => {
    setDeleteErrorMessage('');
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    if (isDeletingAccount) return;

    setIsDeleteModalOpen(false);
    setDeleteErrorMessage('');
  };

  const handleConfirmDeleteAccount = async () => {
    if (isDeletingAccount) return;

    setIsDeletingAccount(true);
    setDeleteErrorMessage('');

    try {
      await deleteUser();
      clearAuthTokens();
      setIsDeleteModalOpen(false);
      navigate('/login', { replace: true });
    } catch (error) {
      console.log('[회원 탈퇴 실패]', error.message);
      setDeleteErrorMessage('회원 탈퇴에 실패했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsDeletingAccount(false);
    }
  };

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

            <div className="section-account-actions">
              <button
                type="button"
                className="mypage-account-button"
                onClick={() => setIsLogoutModalOpen(true)}
              >
                로그아웃
              </button>

              <button
                type="button"
                className="mypage-account-button mypage-account-button--danger"
                onClick={handleOpenDeleteModal}
              >
                탈퇴하기
              </button>
            </div>
          </>
        )}
      </div>

      {isLogoutModalOpen && (
        <Modal
          variant="confirm"
          title="로그아웃"
          titleColor="black"
          description="로그아웃하시겠습니까?"
          confirmText={isLoggingOut ? '로그아웃 중' : '확인'}
          cancelText="취소"
          onClose={() => setIsLogoutModalOpen(false)}
          onCancel={() => setIsLogoutModalOpen(false)}
          onConfirm={handleConfirmLogout}
        />
      )}

      {isDeleteModalOpen && (
        <Modal
          type="error"
          variant="confirm"
          title="회원 탈퇴"
          description="정말 탈퇴하시겠습니까? 탈퇴 후 계정 이용이 제한됩니다."
          confirmText={isDeletingAccount ? '탈퇴 중' : '탈퇴하기'}
          cancelText="취소"
          onClose={handleCloseDeleteModal}
          onCancel={handleCloseDeleteModal}
          onConfirm={handleConfirmDeleteAccount}
        >
          <p className="modal__description">
            정말 탈퇴하시겠습니까? 탈퇴 후 계정 이용이 제한됩니다.
          </p>

          {deleteErrorMessage && (
            <p className="modal__description mypage-account-modal-error">
              {deleteErrorMessage}
            </p>
          )}
        </Modal>
      )}

      {/* 하단 네비게이션 바 */}
      <Nav />
    </div>
  );
};

export default MyPage;
