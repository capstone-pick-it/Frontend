import React from 'react'
import back from '../../assets/images/Chat/back.svg'
import PreferenceCard from '../../components/PreferenceCard'
import Button from '../../components/Button'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { PREFERENCE, USER_INFO } from '../../data/mockData'
import StepBar from '../../components/Onboarding/StepBar'
import { saveOnboardingPersonality } from '../../api/auth'

const OnboardingStep = () => {
  const navigate= useNavigate();
  const handleBack = () => {
    if (currentStep === 0) {
      navigate('/onboardinginfo')
    } else {
      setCurrentStep(currentStep - 1)
    }
  }

  const [currentStep, setCurrentStep] = useState(0)
  const totalSteps = 5;
  const currentItem = PREFERENCE.slice(currentStep*2, currentStep*2+2)

  const handleNext = async() => {
    const currentPairIds = currentItem.map(item => item.id);
    const hasSelection = currentPairIds.some(id => selected.includes(id));
    if (!hasSelection) return;

    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    } else {
      try {
        const traits = formTraits(selected)
        await saveOnboardingPersonality(traits)
        navigate('/onboardingresult')
      } catch (error) {
        console.log(error.status)
        console.log(error.message)
        console.log(error.result)
      }
    }
  }

  const [selected, setSelected] = useState([])
    const handleClick = (id) => {
      const currentPairIds = currentItem.map(item => item.id);
      const filteredSelected = selected.filter((selectedId) => !currentPairIds.includes(selectedId));
      setSelected([...filteredSelected, id]);
    }

  const formTraits = (selected) => {
    return selected.map((id) => ({
      traitItemId: Math.ceil(id / 2),
      selectedType: id % 2 === 1 ? 'A' : 'B',
    }))
  }
    
  
  return (
    <div id="OnboardingStep_Wrap" className="container">
        <header>
          <img src={back} alt="" onClick={() => handleBack()} />
          <StepBar totalSteps={totalSteps} currentStep={currentStep}/>
        </header>
        <div className="text_container">
          <h1>{USER_INFO.name} 님의
            <br />팀플 성향을 알려주세요!
          </h1>
          <p>아래 두가지 성향 중 한가지를 선택해주세요. 추후 마이페이지에서 과목별 수정 및 변경이 가능합니다.</p>
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