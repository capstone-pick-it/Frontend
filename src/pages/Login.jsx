import React from 'react'
import logo from '../assets/images/logo.png'

const Login = () => {
  return (
    <main className="login">
      <section className="login__intro">
        <img className="login__logo" src={logo} alt="Pick-It" />
        <div className="login__copy">
          <h1>Pick-It</h1>
          <p>함께할 팀원을 찾고, 프로젝트를 시작해보세요.</p>
        </div>
      </section>

      <form className="login__form">
        <label className="login__field">
          <span>이메일</span>
          <input type="email" placeholder="이메일을 입력하세요" />
        </label>

        <label className="login__field">
          <span>비밀번호</span>
          <input type="password" placeholder="비밀번호를 입력하세요" />
        </label>

        <button className="login__submit" type="submit">
          로그인
        </button>
      </form>

      <div className="login__links">
        <button type="button">비밀번호 찾기</button>
        <span />
        <button type="button">회원가입</button>
      </div>
    </main>
  )
}

export default Login
