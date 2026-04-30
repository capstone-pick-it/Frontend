import React from 'react'
import more1 from '../assets/images/more1.svg'
import more2 from '../assets/images/more2.svg'
import { useState } from 'react'

const Dropdown = ({ title, option, list = [] }) => {
  const [more, setMore] = useState(false)
  const moreClick = () => {
    setMore(!more)
  }

  const [selected, setSelected] = useState(list[0])

  const handleItemClick = (item) => {
    setSelected(item)
    setMore(false)
  }

  return (
    <div className="Dropdown_Wrap">
        <div className="title">{title}</div>
        <div className="dropdown_container">
          <div className="dropdown">
            <div className="option">{selected}</div>
            <img src={more ? more1 : more2} alt="" onClick={moreClick} />
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