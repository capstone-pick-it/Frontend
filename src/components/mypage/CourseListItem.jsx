import React from 'react';
import { useNavigate } from 'react-router-dom';

import menuIcon from '../../assets/images/MyPage/icon-menu.svg';
import editIcon from '../../assets/images/MyPage/icon-edit.svg';

// 강의 목록에서 강의 하나를 표시하는 컴포넌트
const CourseListItem = ({ course }) => {
  const navigate = useNavigate();

  return (
    <li className="course-list-item">
      {/* 백엔드 연동 후 드래그 정렬 기능 연결 예정 */}
      <button type="button" className="course-list-item__drag-btn">
        <img src={menuIcon} alt="강의 순서 변경" />
      </button>

      {/* 강의명 */}
      <strong className="course-list-item__name">{course.name}</strong>

      {/* 강의 수정 페이지 이동 버튼 */}
      <button
        type="button"
        className="course-list-item__edit-btn"
        onClick={() => navigate(`/mypage/courses/${course.id}/edit`)}
      >
        <img src={editIcon} alt="강의 수정" />
      </button>
    </li>
  );
};

export default CourseListItem;