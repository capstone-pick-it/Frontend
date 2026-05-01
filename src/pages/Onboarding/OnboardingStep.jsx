import React from 'react'
import back from '../../assets/images/Chat/back.svg'
import PreferenceCard from '../../components/PreferenceCard'
import Button from '../../components/Button'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { PREFERENCE } from '../../data/mockData'
import StepBar from '../../components/Onboarding/StepBar'

const OnboardingStep = () => {
  const navigate= useNavigate();
  const handleBack = () => {
    setCurrentStep(currentStep-1)
  }

  const [currentStep, setCurrentStep] = useState(0)
  const totalSteps =5;
  const currentItem = PREFERENCE.slice(currentStep*2, currentStep*2+2)

  const handleNext = () => {
    if(currentStep<4){
      setCurrentStep(currentStep+1)
    }else{
      navigate('/onboardingresult')
    }
  }

  const [selected, setSelected] = useState([])
    const handleClick = (id) => {
      if(selected.includes(id)) {
        setSelected(selected.filter((item) => item !== id))
      } else{
        setSelected([...selected, id])
      }
    }
  
  return (
    <div id="OnboardingStep_Wrap" className="container">
        <header>
          <img src={back} alt="" onClick={() => handleBack()} />
          <StepBar totalSteps={totalSteps} currentStep={currentStep}/>
        </header>
        <div className="text_container">
          <h1>이승희 님의
            <br />팀플 성향을 알려주세요!
          </h1>
          <p>추후 마이페이지에서 과목별 수정 및 변경이 변경가능합니다.</p>
        </div>
        <main>
          {currentItem.map((item) => (
            <PreferenceCard 
              key={item.id}
              title={item.title}
              content={item.content}
              onClick={()=>handleClick(item.id)}
              selected={selected.includes(item.id)}/>
          ))}
        </main>
        <Button title={"다음"} onClick={handleNext} />
    </div>
  )
}

export default OnboardingStep