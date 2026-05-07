import React from 'react';

const Tag = ({ label, variant = 'default', selected = false, onClick }) => {
  const TagName = onClick ? 'button' : 'span';

  return (
    <TagName
      type={onClick ? 'button' : undefined}
      className={`common-tag common-tag--${variant} ${selected ? 'is-selected' : ''}`}
      onClick={onClick}
    >
      {label}
    </TagName>
  );
};

export default Tag;