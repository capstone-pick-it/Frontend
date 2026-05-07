import React from 'react';

const Tag = ({ label, variant = 'default' }) => {
  return (
    <span className={`common-tag common-tag--${variant}`}>
      {label}
    </span>
  );
};

export default Tag;