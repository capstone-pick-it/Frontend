import React from 'react';
import closeIcon from '../assets/images/icon-cancel.svg';
import Button from './Button';

const Modal = ({
  // 모달 타입 (info, error)
  type = 'info',

// default (확인) / confirm (취소+확인)
// recruit-filter (취소+확인 & 모집페이지 모달 전용 스타일)
  variant = 'default',

  title,
  titleColor,
  description,
  children,

  // 버튼 텍스트
  confirmText = '확인',
  cancelText = '취소',

  // 버튼 이벤트
  onConfirm,
  onCancel,
  onClose,

  // 특정 페이지에서 추가 스타일이 필요한 경우 사용
  className = '',
}) => {
  const isError = type === 'error';

  // confirm 계열 모달 여부
  const hasCancel =
    variant === 'confirm' ||
    variant === 'recruit-filter';

  // titleColor를 직접 넘기면 해당 색상 사용
  // 없으면 error 타입은 error, 그 외에는 primary 사용
  const titleColorClass =
    titleColor || (isError ? 'error' : 'primary');

  return (
    <div className="modal-overlay">
      <div className={`modal modal--${type} modal--${variant} ${className}`}>
        {/* 닫기 버튼 */}
        <button
          type="button"
          className="modal__close-btn"
          onClick={onClose}
        >
          <img src={closeIcon} alt="닫기" />
        </button>

        {/* 제목 */}
        <h2 className={`modal__title modal__title--${titleColorClass}`}>
          {title}
        </h2>

        {/* 본문: children이 있으면 children 우선 표시 */}
        <div className="modal__content">
          {children || (
            <p className="modal__description">
              {description}
            </p>
          )}
        </div>

        {/* 하단 버튼 영역 */}
        <div className="modal__actions">
          {hasCancel && (
            <Button
              title={cancelText}
              variant="gray"
              onClick={onCancel}
              className="modal__action-button"
            />
          )}

          <Button
            title={confirmText}
            variant={isError ? 'error' : 'primary'}
            onClick={onConfirm}
            className="modal__action-button"
          />
        </div>
      </div>
    </div>
  );
};

export default Modal;