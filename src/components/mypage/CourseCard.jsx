import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StatBox from '../StatBox';
import Tag from '../Tag';
import Dropdown from '../Dropdown';

// 강의 정보 (courses 배열) 속성 받아오기
const CourseCard = ({ courses = [] }) => {
  const navigate = useNavigate(); 

  const [selectedCourse, setSelectedCourse] = useState(null); // 현재 선택된 강의

  useEffect(() => {
    // 부모로부터 받은 데이터가 존재하면, 기본적으로 첫 번째 강의를 선택 상태로 만듦
    if (courses.length > 0) {
      setSelectedCourse(courses[0]);
    }
  }, [courses]);

  // 드롭다운에 넘겨줄 강의명 목록
  const courseNames = courses.map((course) => course.name);

  // 드롭다운에서 선택한 강의명에 해당하는 강의 객체를 찾아 카드 내용 변경
  const handleCourseChange = (selectedCourseName) => {
    const course = courses.find((course) => course.name === selectedCourseName);

    if (course) {
      setSelectedCourse(course);
    }
  };

  // 데이터가 없거나 렌더링 전일 때
  if (!selectedCourse) {
    return <div className="course-card-loading">강의 정보를 불러오는 중...</div>;
  }

  return (
    <div className="course-card-section">
      
      {/* 1. 상단 헤더: 강의 분기 및 수정 버튼 */}
      <div className="card-header">
        <span className="semester">{selectedCourse.semester}</span>
        <button
          type="button"
          className="edit-link"
          onClick={() => navigate('/mypage/courses')}
        >강의 수정</button>
      </div>

      {/* 2. 강의 타이틀 및 드롭다운 영역 */}
      <div className="card-title-area">
        <Dropdown
          list={courseNames}
          onChange={handleCourseChange}
          variant="inline"
        />
      </div>

      {/* 3. 콘텐츠 영역: 중요도(StatBox) & 성향 태그(Tag) */}
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