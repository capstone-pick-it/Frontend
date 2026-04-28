import React, { useState, useEffect } from 'react';

import Nav from '../components/Nav'
import TopBar from '../components/TopBar'
import ProfileCard from '../components/ProfileCard'

const MyPage = () => {
    // 상태(State) 관리 (현재 더미 데이터)
    const [userInfo, setUserInfo] = useState({
        name: '이승희',
        major: '컴퓨터공학과',
        year: 4,
        level: 1,
        points: 100,
    });

    // API 연동 (백엔드에서 데이터 연동)
    useEffect(() => {
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