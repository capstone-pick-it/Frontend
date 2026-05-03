import React from 'react';

const Button = ({
  title,
  onClick,
  variant = 'primary',
  type = 'button',
  className = '',
}) => {
  return (
    <button
      type={type}
      className={`button button--${variant} ${className}`}
      onClick={onClick}
    >
      {title}
    </button>
  );
};

export default Button;