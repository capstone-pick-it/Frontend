import React, { useState, useEffect } from 'react';

import StatBox from '../StatBox';
import Tag from '../Tag';
import Dropdown from '../Dropdown';

// 강의 정보(배열)와 수정 버튼 이벤트를 부모에서 받아옴
const CourseCard = ({ courses = [], onEdit }) => {
  // 진행중(ONGOING) 강의만 사용
  const ongoingCourses = courses.filter(
    (course) => course.projectStatus === 'ONGOING'
  );

  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    // 진행 중인 강의가 있으면 첫 번째 강의를 기본 선택
    if (ongoingCourses.length > 0) {
      setSelectedCourse(ongoingCourses[0]);
      return;
    }

    // 진행 중인 강의가 없으면 선택 상태 초기화
    setSelectedCourse(null);
  }, [courses]);

  // 드롭다운에 넘겨줄 진행 중인 강의명 목록
  const courseNames = ongoingCourses.map((course) => course.name);

  const handleCourseChange = (selectedCourseName) => {
    const course = ongoingCourses.find(
      (item) => item.name === selectedCourseName
    );

    if (course) {
      setSelectedCourse(course);
    }
  };

  if (!selectedCourse) {
    return <div className="course-card-loading">진행 중인 강의가 없습니다.</div>;
  }

  return (
    <div className="course-card-section">
      {/* 상단 헤더: 강의 분기 및 수정 버튼 */}
      <div className="card-header">
        <span className="semester">{selectedCourse.semester}</span>

        <button
          type="button"
          className="edit-link"
          onClick={onEdit}
        >
          강의 수정
        </button>
      </div>

      {/* 강의 타이틀 및 드롭다운 영역 */}
      <div className="card-title-area">
        <Dropdown
          list={courseNames}
          onChange={handleCourseChange}
          variant="inline"
        />
      </div>

      {/* 콘텐츠 영역: 중요도와 성향 태그 */}
      <div className="card-content">
        <StatBox label="중요도" value={selectedCourse.importance} />

        <div className="tag-group">
          {selectedCourse.traits.map((trait, index) => (
            <Tag key={`${trait}-${index}`} label={trait} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;