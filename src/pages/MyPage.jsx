import React, { useState, useEffect } from 'react';

import Nav from '../components/Nav'
import TopBar from '../components/TopBar'
import ProfileCard from '../components/MyPage/ProfileCard'

import { MYPAGE_USER_INFO } from '../data/mockData';

const MyPage = () => {
    // 초기값 mockData로 설정
    const [userInfo, setUserInfo] = useState(MYPAGE_USER_INFO);

    // API 연동 (백엔드에서 데이터 연동)
    useEffect(() => {
        // 추후 실제 로직 구현
    }, []);

    return (
        <div className="mypage-container">
        
            {/* TopBar */}
            <TopBar title="마이페이지" />

            <div className="mypage-content">

                {/* ProfileCard */}
                <div className="section-profile">
                    <ProfileCard 
                        name={userInfo.name}
                        major={userInfo.major}
                        year={userInfo.year}
                        level={userInfo.level}
                        points={userInfo.points}
                    />
                </div>

                {/* 추후 컴포넌트 추가 */}
                
            </div>

            {/* 하단 네비게이션 바 */}
            <Nav />

        </div>
    );
};

export default MyPage;