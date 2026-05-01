import React from 'react'
import info from '../assets/images/Onboarding/info.svg'
import { useState } from 'react'

const PreferenceCard = ({ title, content, onClick, selected }) => {

  return (
    <div className="PreferenceCard_Wrap" 
    id={selected ? "active" : ""}
    onClick={onClick}>
        <header>
            <img src={info} alt="" />
            <div className="title">{title}</div>
        </header>
        <div className="content">
            {content}
        </div>
    </div>
  )
}

export default PreferenceCard