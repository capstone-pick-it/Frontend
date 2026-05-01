import React from 'react'

const Button = ({ title, onClick }) => {
  return (
    <div id="Button_Wrap" onClick={onClick}>
        {title}
    </div>
  )
}

export default Button