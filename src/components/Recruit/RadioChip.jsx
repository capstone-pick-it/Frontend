import React from 'react';
import radioIcon from '../../assets/images/Recruit/icon-radio.svg';

const RadioChip = ({ label, selected = false, onClick }) => {
  return (
    <button
      type="button"
      className={`radio-chip ${selected ? 'radio-chip--selected' : ''}`}
      onClick={onClick}
    >
      <span className="radio-chip__content">
        <img src={radioIcon} alt="" className="radio-chip__icon" aria-hidden="true" />
        <span className="radio-chip__label">{label}</span>
      </span>
    </button>
  );
};

export default RadioChip;