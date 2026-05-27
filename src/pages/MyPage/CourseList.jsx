import React, { useEffect, useState } from 'react'; 
import { useLocation, useNavigate } from 'react-router-dom';

import Nav from '../../components/Nav';
import TopBar from '../../components/TopBar';
import Modal from '../../components/Modal';
import CourseListItem from '../../components/MyPage/CourseListItem';

import {
  filterActiveProjectCourses,
  getCourseList,
  mapCourseListItem,
  sortCoursesByCourseNameAsc,
} from '../../api/mypage';

// 강의 목록 페이지
const CourseList = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [courses, setCourses] = useState([]);
  const [deletedCourseName, setDeletedCourseName] = useState(
    () => location.state?.deletedCourseName || ''
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadCourses = async () => {
      try {
        const response = await getCourseList();

        if (!isMounted) return;

        setCourses(
          sortCoursesByCourseNameAsc(
            filterActiveProjectCourses((response.result || []).map(mapCourseListItem))
          )
        );
      } catch (error) {
        console.log('[강의 목록 조회 실패]', error.message);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadCourses();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleEditCourse = (courseId) => {
    navigate(`/mypage/courses/${courseId}/edit`);
  };

  const handleCloseDeleteCompleteModal = () => {
    setDeletedCourseName('');
    navigate('/mypage/courses', { replace: true });
  };

  return (
    <div className="container has-topbar course-list-page">
      {/* 상단 헤더 */}
      <TopBar
        title="강의 목록"
        variant="back-add"
        onBack={() => navigate('/mypage')}
        onAdd={() => navigate('/mypage/courses/new')}
      />

      {/* 강의 목록 */}
      <main className="course-list-page__content">
        {isLoading ? (
          <p className="course-list-page__empty">강의 목록을 불러오는 중입니다.</p>
        ) : courses.length > 0 ? (
          <ul className="course-list-page__list">
            {courses.map((course) => (
              <CourseListItem
                key={course.id}
                course={course}
                onEdit={handleEditCourse}
              />
            ))}
          </ul>
        ) : (
          <p className="course-list-page__empty">모집/진행 중인 강의가 없습니다.</p>
        )}
      </main>

      {/* 하단 네비게이션 바 */}
      <Nav />

      {deletedCourseName && (
        <Modal
          type="info"
          title="강의 삭제 완료"
          confirmText="확인"
          onClose={handleCloseDeleteCompleteModal}
          onConfirm={handleCloseDeleteCompleteModal}
        >
          <p className="modal__description">
            '{deletedCourseName}' 강의가 삭제되었어요.
          </p>
        </Modal>
      )}
    </div>
  );
};

export default CourseList;
