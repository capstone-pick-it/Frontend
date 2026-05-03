import React from 'react';
import closeIcon from '../assets/images/icon-cancel.svg';
import Button from './Button';

const Modal = ({
  type = 'info',
  variant = 'default',
  title,
  description,
  children,
  confirmText = '확인',
  cancelText = '취소',
  onConfirm,
  onCancel,
  onClose,
}) => {
  const isError = type === 'error';
  const hasCancel = variant === 'confirm';

  return (
    <div className="modal-overlay">
      <div className={`modal modal--${type}`}>
        {/* 닫기 버튼 */}
        <button type="button" className="modal__close-btn" onClick={onClose}>
          <img src={closeIcon} alt="닫기" />
        </button>

        {/* 제목 */}
        <h2 className="modal__title">{title}</h2>

        {/* 본문: children이 있으면 children을 우선 표시 */}
        <div className="modal__content">
          {children || <p className="modal__description">{description}</p>}
        </div>

        {/* 버튼 영역 */}
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