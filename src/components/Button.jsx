import React from 'react';

// 아이콘 경로 (프로젝트 기준으로 수정)
import chatIcon from '../assets/images/icon-chat2.svg';
import reportIcon from '../assets/images/icon-report.svg';

// 버튼별 기본 문구 + 아이콘 중앙 관리
const BUTTON_PRESETS = {
  chat: {
    title: '채팅하기',
    icon: chatIcon,
  },
  report: {
    title: '신고하기',
    icon: reportIcon,
  },
  'chat-full': {
    title: '채팅하기',
    icon: chatIcon,
  },
};

const Button = ({
  title,
  onClick,
  variant = 'primary',
  type = 'button',
  className = '',
  icon,
}) => {

  const preset = BUTTON_PRESETS[variant];
  const buttonTitle = title ?? preset?.title;
  const buttonIcon = icon ?? preset?.icon;

  return (
    <button
      type={type}
      className={`button button--${variant} ${className}`}
      onClick={onClick}
    >
      {/* 아이콘 + 텍스트 */}
      <span className="button__content">
        {buttonIcon && (
          <img
            src={buttonIcon}
            alt=""
            className="button__icon"
            aria-hidden="true"
          />
        )}

        <span className="button__text">
          {buttonTitle}
        </span>
      </span>
    </button>
  );
};

export default Button;