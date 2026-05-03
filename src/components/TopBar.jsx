import React from 'react';
import { useNavigate } from 'react-router-dom';

import backIcon from '../assets/images/icon-back.svg';
import plusIcon from '../assets/images/MyPage/icon-plus.svg';

// variant: default | back | back-add
const TopBar = ({ title, variant = 'default', onBack, onAdd }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack(); // onBack 있을 시 부모 지정 동작 실행
      return;
    }
    navigate(-1); // 기본 동작: 브라우저 히스토리 한 단계 뒤로 이동
  };

  return (
    <header className={`topbar ${variant}`}>
      {/* 뒤로가기 버튼 */}
      {(variant === 'back' || variant === 'back-add') && (
        <button
          type="button"
          className="back-btn"
          onClick={handleBack}
        >
          <img src={backIcon} alt="뒤로가기" />
        </button>
      )}

      {/* 제목 */}
      <h1>{title}</h1>

      {/* 추가 버튼 */}
      {variant === 'back-add' && (
        <button
          type="button"
          className="add-btn"
          onClick={onAdd}
        >
          <img src={plusIcon} alt="추가" />
        </button>
      )}
    </header>
  );
};

export default TopBar;