import React, { useEffect, useState } from 'react';

import Nav from '../../components/Nav';
import CourseListHeader from '../../components/MyPage/CourseListHeader';
import CourseListItem from '../../components/MyPage/CourseListItem';

import { COURSE_TRAITS } from '../../data/mockData';

// 강의 목록 페이지
const CourseList = () => {
  // 초기값 mockData로 설정
  const [courses, setCourses] = useState(COURSE_TRAITS);

  // API 연동 예정
  useEffect(() => {
    // 추후 GET /me/courses 연동 예정
  }, []);

  return (
    <div className="container course-list-page">
      {/* 상단 헤더 */}
      <CourseListHeader />

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