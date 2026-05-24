import React, { useEffect, useMemo, useState } from 'react';

import TopBar from '../components/TopBar';
import Nav from '../components/Nav';
import Dropdown from '../components/Dropdown';
import Modal from '../components/Modal';
import Tag from '../components/Tag';
import ProfileCard from '../components/ProfileCard';

import SearchBar from '../components/Recruit/SearchBar';
import DropdownChip from '../components/Recruit/DropdownChip';
import RadioChip from '../components/Recruit/RadioChip';

import checkDefault from '../assets/images/Recruit/icon-check.svg';
import checkActive from '../assets/images/Recruit/icon-check_pri.svg';

import {
  COURSE_INFO,
  PREFERENCE,
  RECRUIT_CARD_LIST,
} from '../data/mockData';

const getMatchScore = (card) => {
  // API 연동 시 백엔드가 내려주는 성향일치도 점수 필드를 그대로 사용
  return typeof card.matchScore === 'number' ? card.matchScore : 0;
};

const SORT_OPTIONS = [
  { value: 'default', label: '최신순' },
  { value: 'importance', label: '중요도 높은순' },
  { value: 'level', label: '팀플레벨 높은순' },
  { value: 'match', label: '성향일치도 높은순' },
];

const Recruit = () => {
  // 추후 API 연동 시 setCourses, setCards 부분만 실제 응답값으로 교체
  const [courses, setCourses] = useState(COURSE_INFO);
  const [cards, setCards] = useState(RECRUIT_CARD_LIST);

  const [selectedCourseId, setSelectedCourseId] = useState('');

  // 검색창 입력값과 실제 검색 적용값 분리
  const [searchInput, setSearchInput] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');

  // 기본값: 모집 완료 카드 제외
  const [includeCompleted, setIncludeCompleted] = useState(false);

  // 실제 적용된 정렬 / 성향 필터
  const [sortType, setSortType] = useState('default');
  const [selectedTraits, setSelectedTraits] = useState([]);

  // 모달 내부 임시 선택값
  // 완료 버튼을 눌러야 실제 필터에 반영됨
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [tempSortType, setTempSortType] = useState(sortType);
  const [tempTraits, setTempTraits] = useState(selectedTraits);

  useEffect(() => {
    // API 연동 예정
  }, []);

  // 모집 가능한 강의만 드롭다운에 노출
  const recruitCourses = useMemo(() => {
    return courses.filter((course) => course.projectStatus === 'ONGOING');
  }, [courses]);

  // 모집 가능한 강의가 준비되면 첫 번째 강의를 기본 선택
  useEffect(() => {
    if (!selectedCourseId && recruitCourses.length > 0) {
      setSelectedCourseId(recruitCourses[0].id);
    }
  }, [recruitCourses, selectedCourseId]);

  const selectedCourse = recruitCourses.find((course) => course.id === selectedCourseId);

  const handleSearch = () => {
    setSearchKeyword(searchInput.trim());
  };

  const handleCourseChange = (courseName) => {
    const course = recruitCourses.find((item) => item.name === courseName);
    if (!course) return;

    setSelectedCourseId(course.id);

    // 강의 변경 시 검색어 초기화
    setSearchInput('');
    setSearchKeyword('');
  };

  const handleOpenFilterModal = () => {
    // 모달을 열 때 현재 적용된 필터값을 임시값에 복사
    setTempSortType(sortType);
    setTempTraits(selectedTraits);
    setIsFilterModalOpen(true);
  };

  const handleToggleTempTrait = (trait) => {
    setTempTraits((prev) =>
      prev.includes(trait)
        ? prev.filter((item) => item !== trait)
        : [...prev, trait]
    );
  };

  const handleResetFilter = () => {
    // 정렬기준은 최신순으로 초기화
    setTempSortType('default');

    // 성향칩은 모두 선택 해제
    setTempTraits([]);
  };

  const handleApplyFilter = () => {
    // 임시 선택값을 실제 필터에 반영
    setSortType(tempSortType);
    setSelectedTraits(tempTraits);
    setIsFilterModalOpen(false);
  };

  // 선택된 성향은 앞에 배치하고, 나머지는 뒤에 배치
  const orderedTraits = useMemo(() => {
    const selected = PREFERENCE.filter((trait) => selectedTraits.includes(trait.title));
    const unselected = PREFERENCE.filter((trait) => !selectedTraits.includes(trait.title));

    return [...selected, ...unselected];
  }, [selectedTraits]);

  const filteredCards = useMemo(() => {
    let result = cards;

    // 선택된 강의의 카드만 표시
    if (selectedCourseId) {
      result = result.filter((card) => card.courseId === selectedCourseId);
    }

    // 모집 완료 포함 여부
    if (!includeCompleted) {
      result = result.filter((card) => card.status !== '모집 완료');
    }

    // 사용자 이름 검색
    if (searchKeyword) {
      result = result.filter((card) => card.user.name.includes(searchKeyword));
    }

    // 선택한 성향을 모두 가진 카드만 표시
    if (selectedTraits.length > 0) {
      result = result.filter((card) =>
        selectedTraits.every((trait) => card.traits.includes(trait))
      );
    }

    const importanceScore = {
      높음: 3,
      보통: 2,
      낮음: 1,
    };

    const sortedResult = [...result];

    if (sortType === 'importance') {
      sortedResult.sort(
        (a, b) => importanceScore[b.importance] - importanceScore[a.importance]
      );
    }

    if (sortType === 'level') {
      sortedResult.sort((a, b) => b.user.level - a.user.level);
    }

    if (sortType === 'match') {
      sortedResult.sort((a, b) => {
        return getMatchScore(b) - getMatchScore(a);
      });
    }

    return sortedResult;
  }, [
    cards,
    selectedCourseId,
    includeCompleted,
    searchKeyword,
    selectedTraits,
    sortType,
  ]);

  const isFilterActive = sortType !== 'default' || selectedTraits.length > 0;

  return (
    <div className="container has-topbar recruit-container">
      <TopBar title="모집" />

      <div className="recruit-content">
        <SearchBar
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onSearch={handleSearch}
        />

        <div className="recruit-course">
          <Dropdown
            list={recruitCourses.map((course) => course.name)}
            value={selectedCourse?.name || ''}
            onChange={handleCourseChange}
            variant="recruit"
          />
        </div>

        <div className="recruit-filter-area">
          <div className="recruit-filter-area__top">
            <DropdownChip
              label="정렬기준"
              active={isFilterActive}
              onClick={handleOpenFilterModal}
            />

            <div className="recruit-filter-area__traits">
              {orderedTraits.map((trait) => {
                const isSelected = selectedTraits.includes(trait.title);

                return (
                  <Tag
                    key={trait.id}
                    label={trait.title}
                    variant={isSelected ? 'filter-filled' : 'filter'}
                    onClick={handleOpenFilterModal}
                  />
                );
              })}
            </div>
          </div>

          <button
            type="button"
            className={`recruit-complete-toggle ${includeCompleted ? 'active' : ''}`}
            onClick={() => setIncludeCompleted((prev) => !prev)}
          >
            <img
              src={includeCompleted ? checkActive : checkDefault}
              alt=""
              className="recruit-complete-toggle__icon"
              aria-hidden="true"
            />
            <span>모집 완료 포함</span>
          </button>
        </div>

        <div className="recruit-card-list">
          {filteredCards.map((card) => (
            <ProfileCard
              key={card.id}
              variant="recruit"
              user={card.user}
              status={card.status}
              traits={card.traits}
              importance={card.importance}
              projectSummary={card.projectSummary}
              onChatClick={() => console.log(`${card.user.name} 채팅`)}
            />
          ))}
        </div>
      </div>

      <Nav />

      {isFilterModalOpen && (
        <Modal
          variant="recruit-filter"
          title="정렬기준"
          titleColor="black"
          cancelText="초기화"
          confirmText="완료"
          onCancel={handleResetFilter}
          onConfirm={handleApplyFilter}
          onClose={() => setIsFilterModalOpen(false)}
        >
          <div className="recruit-filter-modal">
            <section className="recruit-filter-modal__section">
              <div className="recruit-filter-modal__chips">
                {SORT_OPTIONS.map((option) => (
                  <RadioChip
                    key={option.value}
                    label={option.label}
                    selected={tempSortType === option.value}
                    onClick={() => setTempSortType(option.value)}
                  />
                ))}
              </div>
            </section>

            <section className="recruit-filter-modal__section">
              <h3 className="recruit-filter-modal__title">성향칩</h3>

              <div className="recruit-filter-modal__chips recruit-filter-modal__chips--traits">
                {PREFERENCE.map((trait) => (
                  <Tag
                    key={trait.id}
                    label={trait.title}
                    variant={tempTraits.includes(trait.title) ? 'filter-outline' : 'filter'}
                    onClick={() => handleToggleTempTrait(trait.title)}
                  />
                ))}
              </div>
            </section>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Recruit;