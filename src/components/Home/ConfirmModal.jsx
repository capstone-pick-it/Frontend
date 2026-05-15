import React from 'react'
import Dropdown from '../Dropdown'
import { useState } from 'react'
import { ONBOARDING_INFO_OPTIONS } from '../../data/mockData'
import ModalDropDown from '../../components/Chat/ModalDropDown'

const ConfirmModal = ({ title, description, cancelText, confirmText, hasDropdown, isModalOpen }) => {

  return (
    <div className="home-modal-backdrop">
      <section className="home-confirm-modal">
        <h2>{title}</h2>
        {description && <p>{description}</p>}
       <div className='confirm-modal-dropdown'>
        {hasDropdown && (
        <ModalDropDown list={ONBOARDING_INFO_OPTIONS.MAJORS} />
       )}
       </div>
        <div>
          <button type="button" onClick={isModalOpen} >{cancelText}</button>
          <button type="button">{confirmText}</button>
        </div>
      </section>
    </div>
  )
}

export default ConfirmModal
