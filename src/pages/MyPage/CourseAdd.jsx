import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import TopBar from '../../components/TopBar';
import Input from '../../components/Input';
import Dropdown from '../../components/Dropdown';
import PreferenceCard from '../../components/PreferenceCard';
import Button from '../../components/Button';
import Nav from '../../components/Nav';

import {
    IMPORTANCE_OPTIONS,
    SEMESTER_OPTIONS,
    TRAIT_OPTIONS,
} from '../../constants/commonOptions';
import {
    createCourse,
    createTraitNameMap,
    getDefaultTraits,
    getTraitItems,
    mapDefaultTraits,
} from '../../api/mypage';

const getTraitPairTitles = (traitTitle) => {
    const selectedTrait = TRAIT_OPTIONS.find((trait) => trait.title === traitTitle);

    if (!selectedTrait) return [];

    const pairStartIndex = Math.floor((selectedTrait.id - 1) / 2) * 2;

    return TRAIT_OPTIONS
        .slice(pairStartIndex, pairStartIndex + 2)
        .map((trait) => trait.title);
};

const selectTraitInPair = (selectedTraits, traitTitle) => {
    const currentPairTitles = getTraitPairTitles(traitTitle);
    const filteredSelected = selectedTraits.filter(
        (selectedTrait) => !currentPairTitles.includes(selectedTrait)
    );

    return sortTraitsByPreferenceOrder([...filteredSelected, traitTitle]);
};

const sortTraitsByPreferenceOrder = (traits = []) => {
    return TRAIT_OPTIONS
        .map((preference) => preference.title)
        .filter((traitTitle) => traits.includes(traitTitle));
};

const normalizeTraitSelectionByPair = (selectedTraits = []) => {
    return selectedTraits.reduce((normalizedTraits, traitTitle) => {
        if (!TRAIT_OPTIONS.some((trait) => trait.title === traitTitle)) {
            return normalizedTraits;
        }

        return selectTraitInPair(normalizedTraits, traitTitle);
    }, []);
};

const CourseAdd = () => {
    const navigate = useNavigate();

    // 상태 관리
    const [courseName, setCourseName] = useState('');
    const [semester, setSemester] = useState(SEMESTER_OPTIONS[0]);
    const [importance, setImportance] = useState(IMPORTANCE_OPTIONS[0]);

    const [selectedTraits, setSelectedTraits] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const loadDefaultTraits = async () => {
            try {
                const [defaultTraitsResult, traitItemsResult] = await Promise.allSettled([
                    getDefaultTraits(),
                    getTraitItems(),
                ]);

                if (defaultTraitsResult.status === 'rejected') {
                    throw defaultTraitsResult.reason;
                }

                if (traitItemsResult.status === 'rejected') {
                    console.log('[성향 항목 조회 실패]', traitItemsResult.reason.message);
                }

                const traitNameMap = traitItemsResult.status === 'fulfilled'
                    ? createTraitNameMap(traitItemsResult.value.result || [])
                    : undefined;

                const defaultTraits = mapDefaultTraits(defaultTraitsResult.value.result || [], traitNameMap);

                if (isMounted) {
                    setSelectedTraits(normalizeTraitSelectionByPair(defaultTraits));
                }
            } catch (error) {
                console.log('[기본 성향 조회 실패]', error.message);
            }
        };

        loadDefaultTraits();

        return () => {
            isMounted = false;
        };
    }, []);

    // 성향 선택 로직
    const handleTraitClick = (traitTitle) => {
        setSelectedTraits((prev) => selectTraitInPair(prev, traitTitle));
    };

    // 제출
    const handleSubmit = async () => {
        if (isSubmitting) return;

        if (!courseName.trim()) {
            alert('강의명을 입력해주세요.');
            return;
        }

        if (selectedTraits.length < 5) {
            alert('각 성향 세트마다 하나씩 선택해주세요.');
            return;
        }

        try {
            setIsSubmitting(true);

            await createCourse({
                courseName: courseName.trim(),
                semester,
                importance,
                traits: selectedTraits,
            });

            navigate('/mypage/courses');
        } catch (error) {
            console.log('[강의 추가 실패]', error.message);
            alert(error.message || '강의 추가에 실패했습니다.');
        } finally {
            setIsSubmitting(false);
        }
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
                    list={SEMESTER_OPTIONS}
                    value={semester}
                    onChange={setSemester}
                />

                {/* 중요도 */}
                <Dropdown
                    title="중요도"
                    list={IMPORTANCE_OPTIONS}
                    value={importance}
                    onChange={setImportance}
                />

                {/* 성향 */}
                <section className="course-add-page__traits">
                    <h2 className="course-add-page__title">팀플 성향</h2>

                    <div className="course-add-page__grid">
                        {TRAIT_OPTIONS.map((item) => (
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
                    title={isSubmitting ? '저장 중' : '완료'}
                    onClick={handleSubmit}
                    className="course-add-page__button"
                />
            </main>

            <Nav />
        </div>
    );
};

export default CourseAdd;
