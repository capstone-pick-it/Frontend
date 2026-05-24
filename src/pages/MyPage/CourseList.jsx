import React, { useEffect, useState } from 'react'; 
import { useNavigate } from 'react-router-dom';

import Nav from '../../components/Nav';
import TopBar from '../../components/TopBar';
import CourseListItem from '../../components/MyPage/CourseListItem';

import { getCourseList, mapCourseListItem } from '../../api/mypage';

// 강의 목록 페이지
const CourseList = () => {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadCourses = async () => {
      try {
        const response = await getCourseList();

        if (!isMounted) return;

        setCourses((response.result || []).map(mapCourseListItem));
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
        ) : (
          <ul className="course-list-page__list">
            {courses.map((course) => (
              <CourseListItem
                key={course.id}
                course={course}
                onEdit={handleEditCourse}
              />
            ))}
          </ul>
        )}
      </main>

      {/* 하단 네비게이션 바 */}
      <Nav />
    </div>
  );
};

export default CourseList;
