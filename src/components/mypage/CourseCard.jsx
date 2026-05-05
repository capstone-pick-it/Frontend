import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StatBox from '../StatBox';
import Tag from '../Tag';
import Dropdown from '../Dropdown';

// 강의 정보 (courses 배열) 속성 받아오기
const CourseCard = ({ courses = [] }) => {
  const navigate = useNavigate(); 

  // COURSE_INFO에는 진행 중, 완료 강의가 모두 있으므로 카드에서는 진행 중 강의만 사용
  const ongoingCourses = courses.filter(
    (course) => course.projectStatus === 'ONGOING'
  );

  const [selectedCourse, setSelectedCourse] = useState(null); // 현재 선택된 강의

  useEffect(() => {
    // 부모로부터 받은 데이터 중 진행 중인 강의가 존재하면, 기본적으로 첫 번째 강의를 선택 상태로 만듦
    if (ongoingCourses.length > 0) {
      setSelectedCourse(ongoingCourses[0]);
      return;
    }

    // 진행 중인 강의가 없으면 선택 상태 초기화
    setSelectedCourse(null);
  }, [courses]);

  // 드롭다운에 넘겨줄 진행 중인 강의명 목록
  const courseNames = ongoingCourses.map((course) => course.name);

  // 드롭다운에서 선택한 강의명에 해당하는 진행 중 강의 객체를 찾아 카드 내용 변경
  const handleCourseChange = (selectedCourseName) => {
    const course = ongoingCourses.find((course) => course.name === selectedCourseName);

    if (course) {
      setSelectedCourse(course);
    }
  };

  // 데이터가 없거나 진행 중인 강의가 없을 때
  if (!selectedCourse) {
    return <div className="course-card-loading">진행 중인 강의가 없습니다.</div>;
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