import React from 'react';
import moreIcon from '../../assets/images/more1.svg';

const DropdownChip = ({ label, active = false, onClick }) => {
  return (
    <button
      type="button"
      className={`dropdown-chip ${active ? 'dropdown-chip--active' : ''}`}
      onClick={onClick}
    >
      <span className="dropdown-chip__content">
        <span className="dropdown-chip__label">{label}</span>
        <img
          src={moreIcon}
          alt=""
          className="dropdown-chip__icon"
          aria-hidden="true"
        />
      </span>
    </button>
  );
};

export default DropdownChip;