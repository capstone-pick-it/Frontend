import React from 'react'
import Input from '../../components/Input'
import Dropdown from '../../components/Dropdown'
import Button from '../../components/Button'
import { useState } from 'react'
import delete_img from '../../assets/images/Onboarding/delete.svg'
import { ONBOARDING_INFO_OPTIONS, USER_INFO } from '../../data/mockData'
import { useNavigate } from 'react-router-dom'
import { saveOnboardingProfile } from '../../api/auth'

const OnboardingInfo = () => {
  const navigate = useNavigate();
  const [lectureList, SetLectureList] = useState([])
  const [input, SetInput] = useState("")

  const [school, setSchool] = useState()
  const [major, setMajor] = useState(ONBOARDING_INFO_OPTIONS.MAJORS[0])
  const [grade, setGrade] = useState(ONBOARDING_INFO_OPTIONS.GRADES[0])
  const [semester, setSemester] = useState(ONBOARDING_INFO_OPTIONS.SEMESTERS[0])

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

  const handleNext = async () => {
    try{
       await saveOnboardingProfile ({
        school,
        major,
        grade : Number(grade),
        semester,
        courses: lectureList,
      })
    navigate('/onboardingstep')
    } catch(error){
      console.log('status:', error.status)
      console.log('message:', error.message)
      console.log('result:', error.result)
    }
  }

  return (
    <div id="OnboardingInfo_Wrap" className="container">
        <h1>{USER_INFO.name} 님에 대해 알려주세요!</h1>
         <Input title={"학교"} value={school} onChange={(e) => setSchool(e.target.value)}/>
        <div className="dropdown_container">
          <Dropdown title={"전공"} list={ONBOARDING_INFO_OPTIONS.MAJORS} value={major} onChange={(value)=>setMajor(value)}/>
          <Dropdown title={"학년"} list={ONBOARDING_INFO_OPTIONS.GRADES} value={grade} onChange={(value)=>setGrade(value)}/>
          <Dropdown title={"학기"} list={ONBOARDING_INFO_OPTIONS.SEMESTERS} value={semester} onChange={(value)=>setSemester(value)}/>
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
        <Button title={"다음"} onClick={() => handleNext()}/>
    </div>
  )
}

export default OnboardingInfo