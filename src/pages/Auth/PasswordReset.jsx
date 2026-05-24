import React, { useState } from 'react'
import AuthButton from '../../components/Auth/AuthButton'
import AuthField from '../../components/Auth/AuthField'
import AuthStepHeader from '../../components/Auth/AuthStepHeader'
import AuthSuccess from '../../components/Auth/AuthSuccess'
import {
  resetPassword,
  sendPasswordResetEmailCode,
  verifyPasswordResetEmailCode,
} from '../../api/auth'

const PasswordReset = ({ onLoginClick }) => {
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [form, setForm] = useState({
    email: '',
    code: '',
    password: '',
    passwordConfirm: '',
  })
  const [successEmail, setSuccessEmail] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const updateForm = (field) => (event) => {
    setForm((prevForm) => ({
      ...prevForm,
      [field]: event.target.value,
    }))
    setErrorMessage('')
  }

  const isPasswordMatched = form.password && form.password === form.passwordConfirm

  const handleSendEmailCode = async () => {
    if (!form.email) {
      setErrorMessage('학교 이메일주소를 입력해주세요.')
      return
    }

    try {
      setIsLoading(true)
      await sendPasswordResetEmailCode({ email: form.email })
      setStep(2)
    } catch (error) {
      setErrorMessage(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerify = async () => {
    if (!form.code) {
      setErrorMessage('인증코드를 입력해주세요.')
      return
    }

    try {
      setIsLoading(true)
      await verifyPasswordResetEmailCode({ email: form.email, code: form.code })
      setStep(3)
    } catch (error) {
      setErrorMessage(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetPassword = async () => {
    if (!isPasswordMatched) {
      setErrorMessage('비밀번호가 일치하지 않습니다.')
      return
    }

    try {
      setIsLoading(true)
      await resetPassword({ email: form.email, newPassword: form.password })
      setSuccessEmail(form.email)
      setStep(4)
    } catch (error) {
      setErrorMessage(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  if (step === 4) {
    return (
      <AuthSuccess
        email={successEmail}
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
            <AuthField
              type="email"
              placeholder="학교 이메일주소"
              value={form.email}
              onChange={updateForm('email')}
            />
            {errorMessage && <p className="auth-message">{errorMessage}</p>}
            <AuthButton disabled={isLoading} onClick={handleSendEmailCode}>
              {isLoading ? '전송 중...' : '메일로 인증코드 받기'}
            </AuthButton>
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <AuthStepHeader title="비밀번호 재설정" step={2} stepTitle="인증코드 입력" />
          <div className="auth-form">
            <AuthField
              placeholder="메일로 전송된 인증코드를 입력해주세요"
              value={form.code}
              onChange={updateForm('code')}
            />
            <button className="auth-link-button signup__resend" type="button" onClick={handleSendEmailCode}>
              인증코드가 전송되지 않았나요?
            </button>
            {errorMessage && <p className="auth-message">{errorMessage}</p>}
            <AuthButton disabled={isLoading} onClick={handleVerify}>인증하기</AuthButton>
          </div>

          {isLoading && <div className="reset-password__loader" />}
        </>
      )}

      {step === 3 && (
        <>
          <AuthStepHeader title="비밀번호 재설정" step={3} stepTitle="비밀번호 설정" />
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
            {errorMessage && <p className="auth-message">{errorMessage}</p>}
            <div className="reset-password__complete">
              <AuthButton disabled={isLoading} onClick={handleResetPassword}>
                {isLoading ? '변경 중...' : '비밀번호 변경 완료'}
              </AuthButton>
            </div>
          </div>
        </>
      )}
    </main>
  )
}

export default PasswordReset
