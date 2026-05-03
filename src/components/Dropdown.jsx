import React, { useState } from 'react';
import more1 from '../assets/images/more1.svg'
// import more2 from '../assets/images/more2.svg'

const Dropdown = ({ title, list = [], onChange, variant = "default" }) => {
  const [more, setMore] = useState(false)
  const moreClick = () => {
    setMore(!more)
  }

  const [selected, setSelected] = useState(list[0])

  const handleItemClick = (item) => {
    setSelected(item)
    setMore(false)
    
    if (onChange) {
      onChange(item)
    }
  }

  return (
    <div className={`Dropdown_Wrap ${variant}`}>
        <div className="title">{title}</div>
        <div className="dropdown_container">
          <div className="dropdown" onClick={moreClick}>
            <div className="option">{selected}</div>
            <img src={more1} alt="" className={more ? 'open' : ''} />
          </div>
          {more && (
            <ul className="list">
              {list.map((item, index) => (
                <li key={index} onClick={() => handleItemClick(item)}>{item}</li>
              ))}
            </ul>
          )}
        </div>
    </div>
  )
}

export default Dropdown