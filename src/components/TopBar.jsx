import React from 'react';
import backIcon from '../assets/images/icon-back.svg';

// title: 페이지명 (ex. 마이페이지)
// variant: 피그마 property (기본값 'default', 뒤로가기 필요시 'back')

const TopBar = ({ title, variant = 'default' }) => {
  return (
    <header className={`topbar ${variant}`}>
      {/* variant가 'back'일 때만 뒤로가기 버튼(아이콘)을 표시 */}
      {variant === 'back' && (
        <button className="back-btn">
          <img src={backIcon} alt="뒤로가기" />
        </button>
      )}
      <h1>{title}</h1>
    </header>
  );
};

export default TopBar;