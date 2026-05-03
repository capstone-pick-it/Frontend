import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Nav from '../../components/Nav';
import TopBar from '../../components/TopBar';
import CourseListItem from '../../components/MyPage/CourseListItem';

import { COURSE_TRAITS } from '../../data/mockData';

// 강의 목록 페이지
const CourseList = () => {
  const navigate = useNavigate();

  // 초기값 mockData로 설정
  const [courses, setCourses] = useState(COURSE_TRAITS);

  // API 연동 (백엔드에서 데이터 연동)
  useEffect(() => {
    // 추후 실제 로직 구현
  }, []);

  return (
    <div className="container course-list-page">
      {/* 상단 헤더 */}
      <TopBar
        title="강의 목록"
        variant="back-add"
        onBack={() => navigate('/mypage')}
        onAdd={() => navigate('/mypage/courses/new')}
      />

      {/* 강의 목록 */}
      <main className="course-list-page__content">
        <ul className="course-list-page__list">
          {courses.map((course) => (
            <CourseListItem key={course.id} course={course} />
          ))}
        </ul>
      </main>

      {/* 하단 네비게이션 바 */}
      <Nav />
    </div>
  );
};

export default CourseList;