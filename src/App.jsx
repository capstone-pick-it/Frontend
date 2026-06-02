import React, { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Outlet, Route, Routes, useNavigate } from 'react-router-dom';
import { ChatRoomsProvider } from './context/ChatRoomsContext';
import { getOnboardingStatus } from './api/auth';
import { clearAuthTokens, getAccessToken } from './api/token';

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

const ProtectedLayout = () => {
  const [authStatus, setAuthStatus] = useState(() => (
    getAccessToken() ? 'checking' : 'unauthenticated'
  ));

  useEffect(() => {
    let isActive = true;

    const verifyAuth = async () => {
      if (!getAccessToken()) {
        setAuthStatus('unauthenticated');
        return;
      }

      try {
        await getOnboardingStatus();
        if (isActive) {
          setAuthStatus('authenticated');
        }
      } catch (error) {
        clearAuthTokens();
        if (isActive) {
          console.log('[보호 라우트 인증 확인 실패]', error.status, error.message);
          setAuthStatus('unauthenticated');
        }
      }
    };

    verifyAuth();

    return () => {
      isActive = false;
    };
  }, []);

  if (authStatus === 'checking') {
    return null;
  }

  if (authStatus === 'unauthenticated') {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

const SplashRoute = () => {
  const navigate = useNavigate();

  useEffect(() => {
    let isActive = true;

    const timer = window.setTimeout(async () => {
      if (!getAccessToken()) {
        navigate('/login', { replace: true });
        return;
      }

      try {
        const { result } = await getOnboardingStatus();
        if (!isActive) return;

        navigate(result?.isCompleted ? '/home' : '/onboarding', { replace: true });
      } catch (error) {
        if (!isActive) return;

        console.log('[스플래시 온보딩 상태 에러]', error.status, error.message);
        navigate('/login', { replace: true });
      }
    }, 900);

    return () => {
      isActive = false;
      window.clearTimeout(timer);
    };
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
      <ChatRoomsProvider>
        <Routes>
          {/* 로그인/회원가입 */}
          <Route path="/" element={<SplashRoute />} />
          <Route path="/login" element={<LoginRoute />} />
          <Route path="/signup" element={<SignupRoute />} />
          <Route path="/reset-password" element={<PasswordResetRoute />} />

          <Route element={<ProtectedLayout />}>
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
          </Route>
        </Routes>
      </ChatRoomsProvider>
    </BrowserRouter>
  );
};

export default App;
