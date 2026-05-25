import React from 'react'
import ModalDropDown from '../../components/Chat/ModalDropDown'

const ConfirmModal = ({
  title,
  description,
  cancelText,
  confirmText,
  hasDropdown,
  onCancel,
  onClose,
  onConfirm,
  dropdownList,
  onCourseChange,
}) => {
  const handleCancel = onCancel || onClose

  return (
    <div className="home-modal-backdrop">
      <section className="home-confirm-modal">
        <h2>{title}</h2>
        {description && <p>{description}</p>}
       <div className='confirm-modal-dropdown'>
        {hasDropdown && (
        <ModalDropDown list={dropdownList} onChange={onCourseChange} />
       )}
       </div>
        <div>
          <button type="button" onClick={handleCancel}>{cancelText}</button>
          <button type="button" onClick={onConfirm}>{confirmText}</button>
        </div>
      </section>
    </div>
  )
}

export default ConfirmModal
