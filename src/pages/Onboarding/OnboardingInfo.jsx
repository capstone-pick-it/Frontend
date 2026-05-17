import React from 'react'
import Input from '../../components/Input'
import Dropdown from '../../components/Dropdown'
import Button from '../../components/Button'
import { useState } from 'react'
import delete_img from '../../assets/images/Onboarding/delete.svg'
import { ONBOARDING_INFO_OPTIONS } from '../../data/mockData'

const OnboardingInfo = () => {
  const [lectureList, SetLectureList] = useState([])
  const [input, SetInput] = useState("")

  const handleAddLecture = () => {
    if(input.trim() === "")
      return
    SetLectureList([...lectureList, input])
    SetInput("")
  }

  const deleteLecture = (index) => {
    const newList = lectureList.filter((_, i) => i !== index);
    SetLectureList(newList)
  }

  return (
    <div id="OnboardingInfo_Wrap" className="container">
        <h1>이승희 님에 대해 알려주세요!</h1>
        <Input title={"학교"}/>
        <div className="dropdown_container">
          <Dropdown title={"전공"} list={ONBOARDING_INFO_OPTIONS.MAJORS} />
          <Dropdown title={"학년"} list={ONBOARDING_INFO_OPTIONS.GRADES} />
          <Dropdown title={"학기"} list={ONBOARDING_INFO_OPTIONS.SEMESTERS} />
        </div>
        <div className="lecture_container">
          <div className="text_container">
            <h1>수강중인 강의</h1>
            <p>*추후 수정 및 변경이 가능합니다.</p>
          </div>
          <div className="input_container">
            <Input value={input} onChange={((e) => SetInput(e.target.value))} />
            <button className="add" onClick={() => handleAddLecture()} >등록</button>
          </div>
          <div className="lecture_content">
            {lectureList.map((item, index) => ( 
              <div className="lecture" key={index}>
                <p>{item}</p>
                <img src={delete_img} alt="삭제" onClick={() => deleteLecture(index)} />
              </div>
            ))}
          </div>
        </div>
        <Button title={"다음"}/>
    </div>
  )
}

export default OnboardingInfo