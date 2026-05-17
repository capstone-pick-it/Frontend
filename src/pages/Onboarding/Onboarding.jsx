import React from 'react'
import Button from '../../components/Button'
import logo from '../../assets/images/logo.png'

import { useNavigate } from 'react-router-dom'

const Onboarding = ({}) => {
    const navigate = useNavigate();
    const handleClick = () =>{
        navigate('/onboardinginfo')
    }
  return (
    <div id="Onboarding_Wrap" className="container">
        <h1>이승희 님 안녕하세요! 
            <br />피킷에서 당신의 팀원을 찾아볼까요?
        </h1>
        <img src={logo} alt="" />
        <Button title={"시작하기"} onClick={handleClick}/>
    </div>
  )
}

export default Onboarding