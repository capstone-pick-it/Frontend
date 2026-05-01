import React from 'react'

const Input = ({ title, onChange, value }) => {
  return (
    <div className="Input_Wrap">
      <div className="title">{title}</div>
        <input type="text" 
        placeholder='내용을 입력해주세요.' 
        onChange={onChange}
        value={value}
        />
    </div>
  )
}

export default Input