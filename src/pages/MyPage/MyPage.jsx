import React, { useState, useEffect } from 'react';

import Nav from '../../components/Nav'
import TopBar from '../../components/TopBar'
import ProfileCard from '../../components/ProfileCard'
import DefaultTraits from '../../components/MyPage/DefaultTraits';
import CourseCard from '../../components/MyPage/CourseCard';
import ProjectHistorySummary from '../../components/MyPage/ProjectHistorySummary';

import { USER_INFO, USER_DEFAULT_TRAITS, COURSE_TRAITS, PROJECT_HISTORY_SUMMARY } from '../../data/mockData';

const MyPage = () => {
    // 초기값 mockData로 설정
    const [userInfo, setUserInfo] = useState(USER_INFO);
    const [traits, setTraits] = useState(USER_DEFAULT_TRAITS);
    const [courses, setCourses] = useState(COURSE_TRAITS);
    const [projectStats, setProjectStats] = useState(PROJECT_HISTORY_SUMMARY);

    // API 연동 (백엔드에서 데이터 연동)
    useEffect(() => {
        // 추후 실제 로직 구현
    }, []);

    return (
        <div className="container has-topbar mypage-container">
        
            {/* 페이지 타이틀 (TopBar) */}
            <TopBar title="마이페이지" />

            <div className="mypage-content">

                {/* 회원 정보 카드 (ProfileCard) */}
                <div className="section-profile">
                    <ProfileCard 
                        name={userInfo.name}
                        major={userInfo.major}
                        year={userInfo.year}
                        level={userInfo.level}
                        points={userInfo.points}
                        enableStatModal
                    />
                </div>

                {/* 기본 팀플 성향 (DefaultTraits) */}
                <div className="section-default-traits">
                    <DefaultTraits 
                        traits={traits}
                        onEdit={() => {
                            console.log('성향 수정 클릭');
                        }}
                    />
                </div>

                {/* 강의 정보 카드 (CourseCard) */}
                <div className="section-course-card">
                    <CourseCard courses={courses} />
                </div>

                {/* 프로젝트 이력 (ProjectHistorySummary) */}
                <div className="section-project-history-summary">
                    <ProjectHistorySummary stats={projectStats} />
                </div>
                
            </div>

            {/* 하단 네비게이션 바 */}
            <Nav />

        </div>
    );
};

export default MyPage;
