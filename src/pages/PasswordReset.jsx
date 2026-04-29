import React, { useState } from 'react'
import AuthButton from '../components/auth/AuthButton'
import AuthField from '../components/auth/AuthField'
import AuthStepHeader from '../components/auth/AuthStepHeader'
import AuthSuccess from '../components/auth/AuthSuccess'

const EMAIL = '20220201@sungshin'

const PasswordReset = ({ onLoginClick }) => {
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  const handleVerify = () => {
    setIsLoading(true)
    window.setTimeout(() => {
      setIsLoading(false)
      setStep(3)
    }, 700)
  }

  if (step === 4) {
    return (
      <AuthSuccess
        email={EMAIL}
        message="비밀번호가 변경되었습니다."
        buttonText="로그인하러가기"
        onButtonClick={onLoginClick}
      />
    )
  }

  return (
    <main className="auth-page reset-password">
      {step === 1 && (
        <>
          <AuthStepHeader title="비밀번호 재설정" step={1} stepTitle="인증코드 발송" />
          <div className="auth-form signup__email-form">
            <AuthField type="email" placeholder="학교 이메일주소" />
            <AuthButton onClick={() => setStep(2)}>메일로 인증코드 받기</AuthButton>
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <AuthStepHeader title="비밀번호 재설정" step={2} stepTitle="인증코드 입력" />
          <div className="auth-form">
            <AuthField placeholder="메일로 전송된 인증코드를 입력해주세요" />
            <button className="auth-link-button signup__resend" type="button">
              인증코드가 전송되지 않았나요?
            </button>
            <AuthButton disabled={isLoading} onClick={handleVerify}>인증하기</AuthButton>
          </div>

          {isLoading && <div className="reset-password__loader" />}
        </>
      )}

      {step === 3 && (
        <>
          <AuthStepHeader title="비밀번호 재설정" step={3} stepTitle="비밀번호 설정" />
          <div className="auth-form">
            <AuthField type="password" placeholder="비밀번호" />
            <AuthField type="password" placeholder="비밀번호 확인" />
            <p className="auth-message is-valid">비밀번호가 확인되었어요!</p>
            <div className="reset-password__complete">
              <AuthButton onClick={() => setStep(4)}>비밀번호 변경 완료</AuthButton>
            </div>
          </div>
        </>
      )}
    </main>
  )
}

export default PasswordReset
