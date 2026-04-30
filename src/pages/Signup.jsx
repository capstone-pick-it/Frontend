import React, { useState } from 'react'
import AuthButton from '../components/Login/AuthButton'
import AuthField from '../components/Login/AuthField'
import AuthStepHeader from '../components/Login/AuthStepHeader'
import AuthSuccess from '../components/Login/AuthSuccess'

const EMAIL = '20220201@sungshin'

const Signup = ({ onLoginClick }) => {
  const [step, setStep] = useState(1)

  if (step === 4) {
    return (
      <AuthSuccess
        email={EMAIL}
        message="가입이 완료되었습니다!"
        buttonText="로그인하러가기"
        onButtonClick={onLoginClick}
      />
    )
  }

  return (
    <main className="auth-page signup">
      {step === 1 && (
        <>
          <AuthStepHeader title="회원가입" step={1} stepTitle="학교인증" />
          <div className="auth-form signup__email-form">
            <AuthField type="email" placeholder="학교 이메일주소" />
            <AuthButton onClick={() => setStep(2)}>메일로 인증코드 받기</AuthButton>
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <AuthStepHeader title="회원가입" step={2} stepTitle="인증코드 입력" />
          <div className="auth-form">
            <AuthField placeholder="메일로 전송된 인증코드를 입력해주세요" />
            <button className="auth-link-button signup__resend" type="button">
              인증코드가 전송되지 않았나요?
            </button>
            <AuthButton onClick={() => setStep(3)}>인증하기</AuthButton>
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <AuthStepHeader title="회원가입" step={3} stepTitle="비밀번호 설정" />
          <div className="auth-form">
            <AuthField type="password" placeholder="비밀번호" />
            <AuthField type="password" placeholder="비밀번호 확인" />
            <p className="auth-message is-valid">비밀번호가 확인되었어요!</p>
          </div>

          <section className="signup__name">
            <h2>4. 이름</h2>
            <AuthField placeholder="이름" />
          </section>

          <div className="signup__bottom-button">
            <AuthButton onClick={() => setStep(4)}>회원가입 완료</AuthButton>
          </div>
        </>
      )}
    </main>
  )
}

export default Signup
