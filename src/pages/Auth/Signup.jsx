import React, { useState } from 'react'
import AuthButton from '../../components/Auth/AuthButton'
import AuthField from '../../components/Auth/AuthField'
import AuthStepHeader from '../../components/Auth/AuthStepHeader'
import AuthSuccess from '../../components/Auth/AuthSuccess'
import { sendSignupEmailCode, signupUser, verifySignupEmailCode } from '../../api/auth'

const Signup = ({ onLoginClick }) => {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    email: '',
    code: '',
    password: '',
    passwordConfirm: '',
    nickname: '',
  })
  const [successEmail, setSuccessEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSendingCode, setIsSendingCode] = useState(false)
  const [isVerifyingCode, setIsVerifyingCode] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const updateForm = (field) => (event) => {
    setForm((prevForm) => ({
      ...prevForm,
      [field]: event.target.value,
    }))
    setErrorMessage('')
  }

  const isPasswordMatched = form.password && form.password === form.passwordConfirm
  const handleBack = () => {
    if (step > 1) {
      setStep((prevStep) => prevStep - 1)
      setErrorMessage('')
      return
    }

    onLoginClick()
  }

  const handleSendEmailCode = async () => {
    if (!form.email) {
      setErrorMessage('학교 이메일주소를 입력해주세요.')
      return
    }

    try {
      setIsSendingCode(true)
      await sendSignupEmailCode({ email: form.email })
      setStep(2)
    } catch (error) {
      setErrorMessage(error.message)
    } finally {
      setIsSendingCode(false)
    }
  }

  const handleVerifyEmailCode = async () => {
    if (!form.code) {
      setErrorMessage('인증코드를 입력해주세요.')
      return
    }

    try {
      setIsVerifyingCode(true)
      await verifySignupEmailCode({ email: form.email, code: form.code })
      setStep(3)
    } catch (error) {
      setErrorMessage(error.message)
    } finally {
      setIsVerifyingCode(false)
    }
  }

  const handleSignup = async () => {
    if (!isPasswordMatched) {
      setErrorMessage('비밀번호가 일치하지 않습니다.')
      return
    }

    if (!form.email || !form.password || !form.nickname) {
      setErrorMessage('이메일, 비밀번호, 이름을 모두 입력해주세요.')
      return
    }

    try {
      setIsSubmitting(true)
      const response = await signupUser({
        email: form.email,
        password: form.password,
        nickname: form.nickname,
      })

      setSuccessEmail(response.result?.email || form.email)
      setStep(4)
    } catch (error) {
      setErrorMessage(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (step === 4) {
    return (
      <AuthSuccess
        email={successEmail}
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
          <AuthStepHeader title="회원가입" step={1} stepTitle="학교인증" onBack={handleBack} />
          <div className="auth-form signup__email-form">
            <AuthField
              type="email"
              placeholder="학교 이메일주소"
              value={form.email}
              onChange={updateForm('email')}
            />
            {errorMessage && <p className="auth-message">{errorMessage}</p>}
            <AuthButton disabled={isSendingCode} onClick={handleSendEmailCode}>
              {isSendingCode ? '전송 중...' : '메일로 인증코드 받기'}
            </AuthButton>
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <AuthStepHeader title="회원가입" step={2} stepTitle="인증코드 입력" onBack={handleBack} />
          <div className="auth-form">
            <AuthField
              placeholder="메일로 전송된 인증코드를 입력해주세요"
              value={form.code}
              onChange={updateForm('code')}
            />
            <button className="auth-link-button signup__resend" type="button">
              인증코드가 전송되지 않았나요?
            </button>
            {errorMessage && <p className="auth-message">{errorMessage}</p>}
            <AuthButton disabled={isVerifyingCode} onClick={handleVerifyEmailCode}>
              {isVerifyingCode ? '인증 중...' : '인증하기'}
            </AuthButton>
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <AuthStepHeader title="회원가입" step={3} stepTitle="비밀번호 설정" onBack={handleBack} />
          <div className="auth-form">
            <AuthField
              type="password"
              placeholder="비밀번호"
              value={form.password}
              onChange={updateForm('password')}
            />
            <AuthField
              type="password"
              placeholder="비밀번호 확인"
              value={form.passwordConfirm}
              onChange={updateForm('passwordConfirm')}
            />
            {form.passwordConfirm && (
              <p className={`auth-message ${isPasswordMatched ? 'is-valid' : ''}`}>
                {isPasswordMatched ? '비밀번호가 확인되었어요!' : '입력된 비밀번호가 같지 않아요'}
              </p>
            )}
          </div>

          <section className="signup__name">
            <h2>4. 이름</h2>
            <AuthField placeholder="이름" value={form.nickname} onChange={updateForm('nickname')} />
            {errorMessage && <p className="auth-message">{errorMessage}</p>}
          </section>

          <div className="signup__bottom-button">
            <AuthButton disabled={isSubmitting} onClick={handleSignup}>
              {isSubmitting ? '회원가입 중...' : '회원가입 완료'}
            </AuthButton>
          </div>
        </>
      )}
    </main>
  )
}

export default Signup
