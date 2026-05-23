import React, { useEffect } from 'react';
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
import { getOnboardingStatus } from './api/auth';

import './assets/sass/style.scss';

// 로그인/회원가입 관련 경로 import
import Login from './pages/Auth/Login';
import PasswordReset from './pages/Auth/PasswordReset';
import Signup from './pages/Auth/Signup';
import Splash from './pages/Auth/Splash';

// 온보딩 관련 경로 import
import Onboarding from './pages/Onboarding/Onboarding';
import OnboardingInfo from './pages/Onboarding/OnboardingInfo';
import OnboardingStep from './pages/Onboarding/OnboardingStep';
import OnboardingResult from './pages/Onboarding/OnboardingResult';

// 홈 관련 경로 import
import Home from './pages/Home/Home';

// 모집페이지 관련 경로 import
import Recruit from './pages/Recruit';

// Chat 페이지 관련 경로 import
import Chat from './pages/Chat/Chat';
import ChatRoom from './pages/Chat/ChatRoom';

// 마이페이지 관련 경로 import
import MyPage from './pages/MyPage/MyPage';
import TraitsEdit from './pages/MyPage/TraitsEdit';
import CourseList from './pages/MyPage/CourseList';
import CourseAdd from './pages/MyPage/CourseAdd';
import CourseEdit from './pages/MyPage/CourseEdit';
import ProjectHistory from './pages/MyPage/ProjectHistory';

const AuthLayout = ({ children }) => {
  return <div className="container auth-container">{children}</div>;
};

const SplashRoute = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      navigate('/login');
    }, 900);

    return () => window.clearTimeout(timer);
  }, [navigate]);

  return (
    <AuthLayout>
      <Splash />
    </AuthLayout>
  );
};

const LoginRoute = () => {
  const navigate = useNavigate();

  return (
    <AuthLayout>
      <Login
        onSignupClick={() => navigate('/signup')}
        onResetPasswordClick={() => navigate('/reset-password')}
        onLoginSuccess={async () => {
          try {
            const { result } = await getOnboardingStatus()
            console.log('[온보딩 상태]', result)
            navigate(result?.isCompleted ? '/home' : '/onboarding')
          } catch (error) {
            console.log('[온보딩 상태 에러]', error.status, error.message)
            navigate('/onboarding')
          }
        }}
      />
    </AuthLayout>
  );
};

const SignupRoute = () => {
  const navigate = useNavigate();

  return (
    <AuthLayout>
      <Signup onLoginClick={() => navigate('/login')} />
    </AuthLayout>
  );
};

const PasswordResetRoute = () => {
  const navigate = useNavigate();

  return (
    <AuthLayout>
      <PasswordReset onLoginClick={() => navigate('/login')} />
    </AuthLayout>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* 로그인/회원가입 */}
        <Route path="/" element={<SplashRoute />} />
        <Route path="/login" element={<LoginRoute />} />
        <Route path="/signup" element={<SignupRoute />} />
        <Route path="/reset-password" element={<PasswordResetRoute />} />

        {/* 홈 */}
        <Route path="/home/*" element={<Home />} />

        {/* 온보딩 */}
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/onboardinginfo" element={<OnboardingInfo />} />
        <Route path="/onboardingstep" element={<OnboardingStep />} />
        <Route path="/onboardingresult" element={<OnboardingResult />} />

        {/* 모집 */}
        <Route path="/recruit" element={<Recruit />} />

        {/* 채팅 */}
        <Route path="/chat" element={<Chat />} />
        <Route path="/chatroom/:roomId" element={<ChatRoom />} />

        {/* 마이페이지 */}
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/mypage/traits/edit" element={<TraitsEdit />} />
        <Route path="/mypage/courses" element={<CourseList />} />
        <Route path="/mypage/courses/new" element={<CourseAdd />} />
        <Route path="/mypage/courses/:courseId/edit" element={<CourseEdit />} />
        <Route path="/mypage/project-history" element={<ProjectHistory />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;