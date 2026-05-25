import React from 'react'
import ProfileCard from '../../components/ProfileCard'
import Button from '../../components/Button'
import { useNavigate } from 'react-router-dom'
import { USER_INFO } from '../../data/mockData'
import {
  IMPORTANCE_OPTIONS,
  MAJOR_OPTIONS,
  TRAIT_OPTIONS,
} from '../../constants/commonOptions'

const OnboardingResult = () => {
  const navigate = useNavigate();
  return (
    <div id="OnboardingResult_Wrap" className="container">
      <div className="text_container">
        <h1>{USER_INFO.name} 님의
          <br />카드가 만들어졌어요 !
        </h1>
        <p>과목별 성향 및 중요도 편집은 마이페이지에서 가능합니다.</p>
      </div>
      <main>
        <ProfileCard
          variant="onboarding"
          name={USER_INFO.name}
          major={MAJOR_OPTIONS[0]}
          year={4}
          level={1}
          points={100}
          status="모집 중"
          traits={[
            TRAIT_OPTIONS[0].title,
            TRAIT_OPTIONS[3].title,
            TRAIT_OPTIONS[4].title,
          ]}
          importance={IMPORTANCE_OPTIONS[0]}
        />
      </main>
      <Button title={"완료"} onClick={() => navigate('/home')}/>
    </div>
  )
}

export default OnboardingResult
