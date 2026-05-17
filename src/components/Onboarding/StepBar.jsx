import React from 'react'

const StepBar = ({ totalSteps, currentStep }) => {
  return (
    <div id="StepBar_Wrap">
        {Array.from({length : totalSteps},((_,index) => (
            <div 
            className={`stepbar ${index <= currentStep ? "active" : ""}`}
            key={index}
            >
            </div>
        )
        ))}
    </div>
  )
}

export default StepBar