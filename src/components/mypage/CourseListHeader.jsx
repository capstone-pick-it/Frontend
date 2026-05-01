import React from 'react';
import { useNavigate } from 'react-router-dom';

import backIcon from '../../assets/images/icon-back.svg';
import plusIcon from '../../assets/images/MyPage/icon-plus.svg';

const CourseListHeader = ({ title = '강의 목록' }) => {
  const navigate = useNavigate();

  return (
    <header className="course-list-header">
      {/* 뒤로가기 버튼 */}
      <button
        type="button"
        className="course-list-header__back-btn"
        onClick={() => navigate('/mypage')}
      >
        <img src={backIcon} alt="뒤로가기" />
      </button>

      {/* 페이지 제목 */}
      <h1 className="course-list-header__title">{title}</h1>

      {/* 강의 추가 페이지 이동 버튼 */}
      <button
        type="button"
        className="course-list-header__add-btn"
        onClick={() => navigate('/mypage/courses/new')}
      >
        <img src={plusIcon} alt="강의 추가" />
      </button>
    </header>
  );
};

export default CourseListHeader;