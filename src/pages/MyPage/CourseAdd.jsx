import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import TopBar from '../../components/TopBar';
import Input from '../../components/Input';
import Dropdown from '../../components/Dropdown';
import PreferenceCard from '../../components/PreferenceCard';
import Button from '../../components/Button';
import Nav from '../../components/Nav';

import {
    ONBOARDING_INFO_OPTIONS,
    PREFERENCE,
    USER_DEFAULT_TRAITS,
} from '../../data/mockData';

const CourseAdd = () => {
    const navigate = useNavigate();

    // 상태 관리
    const [courseName, setCourseName] = useState('');
    const [semester, setSemester] = useState(ONBOARDING_INFO_OPTIONS.SEMESTERS[0]);
    const [importance, setImportance] = useState('높음');

    // 기본 성향으로 초기값 세팅
    const [selectedTraits, setSelectedTraits] = useState(USER_DEFAULT_TRAITS);

    // 성향 선택 로직
    const handleTraitClick = (traitTitle) => {
        setSelectedTraits((prev) =>
            prev.includes(traitTitle)
                ? prev.filter((trait) => trait !== traitTitle)
                : [...prev, traitTitle]
        );
    };

    // 제출
    const handleSubmit = () => {
        const newCourse = {
            name: courseName,
            semester,
            importance,
            traits: selectedTraits,
        };

        console.log('추가될 강의:', newCourse);

        // API 연동 (백엔드에서 데이터 연동)
        // await createCourse(newCourse)

        navigate('/mypage/courses');
    };

    return (
        <div className="container has-topbar course-add-page">
            <TopBar
                title="강의 추가"
                variant="back"
                onBack={() => navigate('/mypage/courses')}
            />

            <main className="course-add-page__content">
                {/* 강의명 */}
                <Input
                    title="강의명"
                    value={courseName}
                    onChange={(e) => setCourseName(e.target.value)}
                />

                {/* 수강학기 */}
                <Dropdown
                    title="수강학기"
                    list={ONBOARDING_INFO_OPTIONS.SEMESTERS}
                    value={semester}
                    onChange={setSemester}
                />

                {/* 중요도 */}
                <Dropdown
                    title="중요도"
                    list={['높음', '보통', '낮음']}
                    value={importance}
                    onChange={setImportance}
                />

                {/* 성향 */}
                <section className="course-add-page__traits">
                    <h2 className="course-add-page__title">팀플 성향</h2>

                    <div className="course-add-page__grid">
                        {PREFERENCE.map((item) => (
                            <PreferenceCard
                                key={item.id}
                                title={item.title}
                                content={item.content}
                                selected={selectedTraits.includes(item.title)}
                                onClick={() => handleTraitClick(item.title)}
                            />
                        ))}
                    </div>
                </section>

                {/* 완료 버튼 */}
                <Button
                    title="완료"
                    onClick={handleSubmit}
                    className="course-add-page__button"
                />
            </main>

            <Nav />
        </div>
    );
};

export default CourseAdd;