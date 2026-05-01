import React from 'react'
import ProfileCard from '../../components/ProfileCard'
import Button from '../../components/Button'

const OnboardingResult = () => {
  return (
    <div id="OnboardingResult_Wrap" className="container">
      <div className="text_container">
        <h1>이승희 님의
          <br />카드가 만들어졌어요 !
        </h1>
        <p>과목별 성향 및 중요도 편집은 마이페이지에서 가능합니다.</p>
      </div>
      <main>
        <ProfileCard
        name={"이승희"}
        major={"컴퓨터공학과"}
        year={"4힉년"}
        level={"1"}
        points={"100"}
        />
      </main>
      <Button title={"완료"}/>
    </div>
  )
}

export default OnboardingResult