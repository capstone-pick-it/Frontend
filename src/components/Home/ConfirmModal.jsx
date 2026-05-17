import React from 'react'

const ConfirmModal = ({ title, description, cancelText, confirmText, onClose, onCancel, onConfirm }) => {
  return (
    <div className="home-modal-backdrop">
      <section className="home-confirm-modal">
        <h2>{title}</h2>
        {description && <p>{description}</p>}
        <div>
          <button type="button" onClick={onCancel || onClose}>{cancelText}</button>
          <button type="button" onClick={onConfirm || onClose}>{confirmText}</button>
        </div>
      </section>
    </div>
  )
}

export default ConfirmModal
