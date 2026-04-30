import React from 'react'

const Input = ({ title }) => {
  return (
    <div className="Input_Wrap">
      <div className="title">{title}</div>
        <input type="text" />
    </div>
  )
}

export default Input