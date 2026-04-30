import React from 'react'
import Input from '../../components/Input'
import Dropdown from '../../components/Dropdown'

const OnboardingInfo = () => {

  const major = ["컴퓨터공학과", "서비스디자인공학과"];
  const grade = [1,2,3,4];
  const semester= ["2026년 1학기", "2025년 2학기", "2025년 1학기", "2024년 2학기", "2024년 1학기"];

  return (
    <div id="OnboardingInfo_Wrap" className="container">
        <h1>이승희 님에 대해 알려주세요!</h1>
        <Input title={"학교"}/>
        <Dropdown title={"전공"} list={major} />
        <Dropdown title={"학년"} list={grade} />
        <Dropdown title={"학기"} list={semester} />
    </div>
  )
}

export default OnboardingInfo