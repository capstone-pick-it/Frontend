import React from 'react';

const Input = ({
  title,
  onChange,
  value,
  placeholder = '내용을 입력해주세요.',
  disabled = false, // 비활성화 기본 false
}) => {
  return (
    <div className={`Input_Wrap ${disabled ? 'disabled' : ''}`}>
      <div className="title">{title}</div>

      <input
        type="text"
        placeholder={placeholder}
        onChange={onChange}
        value={value}
        disabled={disabled}
      />
    </div>
  );
};

export default Input;