import React from 'react';
import radioDefault from '../../assets/images/Recruit/icon-radio.svg';
import radioActive from '../../assets/images/Recruit/icon-radio_pri.svg';

const RadioChip = ({ label, selected = false, onClick }) => {
  return (
    <button
      type="button"
      className={`radio-chip ${selected ? 'radio-chip--selected' : ''}`}
      onClick={onClick}
    >
      <span className="radio-chip__content">
        <img
          src={selected ? radioActive : radioDefault}
          alt=""
          className="radio-chip__icon"
        />
        <span className="radio-chip__label">{label}</span>
      </span>
    </button>
  );
};

export default RadioChip;