import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

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
  DEFAULT_RECRUITING_MEMBERS_PAGE,
  getRecruitCourses,
  getRecruitingMembers,
  getTraitItems,
  toTraitFilters,
} from '../api/recruit';
import { IMPORTANCE_LABEL_BY_VALUE } from '../constants/commonOptions';

const SORT_OPTIONS = [
  { value: 'match', label: '성향 유사순' },
  { value: 'importance', label: '중요도 높은순' },
  { value: 'level', label: '팀플레벨 높은순' },
  { value: 'default', label: '최신순' },
];

const RECRUIT_STATUS = {
  RECRUITING: 'RECRUITING',
  CONFIRM_PENDING: 'CONFIRM_PENDING',
  RECRUITMENT_COMPLETED: 'RECRUITMENT_COMPLETED',
}

const LEGACY_RECRUIT_STATUS_MAP = {
  '모집 중': RECRUIT_STATUS.RECRUITING,
  '확정 대기': RECRUIT_STATUS.CONFIRM_PENDING,
  '모집 완료': RECRUIT_STATUS.RECRUITMENT_COMPLETED,
}

const RECRUIT_STATUS_LABELS = {
  [RECRUIT_STATUS.RECRUITING]: '모집 중',
  [RECRUIT_STATUS.CONFIRM_PENDING]: '확정 대기',
  [RECRUIT_STATUS.RECRUITMENT_COMPLETED]: '모집 완료',
}

const ACTIVE_RECRUIT_STATUSES = new Set([
  RECRUIT_STATUS.RECRUITING,
  RECRUIT_STATUS.CONFIRM_PENDING,
])

const RECRUIT_STATUSES_WITH_COMPLETED = new Set([
  ...ACTIVE_RECRUIT_STATUSES,
  RECRUIT_STATUS.RECRUITMENT_COMPLETED,
])

const getRecruitCardUser = (card) => {
  if (card.user) return card.user

  return {
    name: card.userName ?? card.nickname ?? card.name,
    major: card.major ?? card.department,
    year: card.grade ?? card.year,
    level: card.teamLevel ?? card.level,
    points: card.points ?? card.point,
  }
}

const getRecruitCardKey = (card) => {
  const user = getRecruitCardUser(card)

  return card.id
    ?? card.userCourseProfileId
    ?? card.userId
    ?? `${card.courseId}-${user.name || 'unknown'}`
}

const getRecruitCardTraits = (card) => card.traits || card.defaultTraits || []

const getRecruitCardProjectSummary = (card) => {
  if (card.projectSummary) return card.projectSummary

  return {
    projectCount: card.projectCount ?? 0,
    completionRate: card.completionRate ?? 0,
    averagePeerReview: card.averagePeerReview ?? card.averagePeerRating ?? 0,
    maxPeerReviewScore: 5,
  }
}

const getRecruitCardImportance = (card) => {
  const importance = card.importance

  return IMPORTANCE_LABEL_BY_VALUE[importance] || importance || ''
}

const getRecruitCardStatus = (card) => {
  const status = card.recruitmentStatus || card.status

  return LEGACY_RECRUIT_STATUS_MAP[status] || status
}

const getRecruitCardStatusLabel = (card) => {
  const status = getRecruitCardStatus(card)

  return RECRUIT_STATUS_LABELS[status] || card.status || ''
}

const isVisibleRecruitCard = (card, includeCompleted) => {
  const status = getRecruitCardStatus(card)
  const visibleStatuses = includeCompleted
    ? RECRUIT_STATUSES_WITH_COMPLETED
    : ACTIVE_RECRUIT_STATUSES

  return visibleStatuses.has(status)
}

const fetchRecruitPageData = async () => {
  const [courses, traitItems] = await Promise.all([
    getRecruitCourses(),
    getTraitItems(),
  ]);

  return {
    recruitCourses: courses,
    traitFilters: toTraitFilters(traitItems),
  };
};

const Recruit = () => {
  const [courses, setCourses] = useState([]);
  const [cards, setCards] = useState([]);
  const [traitFilters, setTraitFilters] = useState([]);
  const [isRecruitLoading, setIsRecruitLoading] = useState(true);
  const [isCardLoading, setIsCardLoading] = useState(false);
  const [isLoadingMoreCards, setIsLoadingMoreCards] = useState(false);
  const [cardPage, setCardPage] = useState(DEFAULT_RECRUITING_MEMBERS_PAGE);
  const [hasNextCardPage, setHasNextCardPage] = useState(false);
  const loadMoreTriggerRef = useRef(null);
  const isLoadingMoreCardsRef = useRef(false);

  const [selectedCourseId, setSelectedCourseId] = useState('');

  // 검색창 입력값과 실제 검색 적용값 분리
  const [searchInput, setSearchInput] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');

  // 기본값: 모집 완료 카드 제외
  const [includeCompleted, setIncludeCompleted] = useState(false);

  // 실제 적용된 정렬 / 성향 필터
  const [sortType, setSortType] = useState('match');
  const [selectedTraits, setSelectedTraits] = useState([]);

  // 모달 내부 임시 선택값
  // 완료 버튼을 눌러야 실제 필터에 반영됨
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [tempSortType, setTempSortType] = useState(sortType);
  const [tempTraits, setTempTraits] = useState(selectedTraits);

  const cardQueryKey = useMemo(() => {
    return [
      selectedCourseId,
      searchKeyword,
      sortType,
      includeCompleted,
      selectedTraits.join(','),
    ].join('|')
  }, [selectedCourseId, searchKeyword, sortType, includeCompleted, selectedTraits]);
  const cardQueryKeyRef = useRef(cardQueryKey);

  useEffect(() => {
    let ignore = false;

    const loadRecruitPage = async () => {
      try {
        setIsRecruitLoading(true);

        const pageData = await fetchRecruitPageData();
        if (ignore) return;

        setCourses(pageData.recruitCourses);
        setTraitFilters(pageData.traitFilters);
        setSelectedCourseId((prev) => {
          if (pageData.recruitCourses.some((course) => course.id === prev)) return prev;

          return pageData.recruitCourses[0]?.id || '';
        });
      } catch (error) {
        console.error('[모집 페이지 조회 실패]', error.message);
        if (!ignore) {
          setCourses([]);
          setCards([]);
          setTraitFilters([]);
        }
      } finally {
        if (!ignore) {
          setIsRecruitLoading(false);
        }
      }
    };

    loadRecruitPage();

    return () => {
      ignore = true;
    };
  }, []);

  const recruitCourses = useMemo(() => {
    return courses;
  }, [courses]);

  const selectedCourse = recruitCourses.find((course) => course.id === selectedCourseId);

  useEffect(() => {
    let ignore = false;
    cardQueryKeyRef.current = cardQueryKey;

    const loadRecruitCards = async () => {
      if (!selectedCourseId) {
        setCards([]);
        setCardPage(DEFAULT_RECRUITING_MEMBERS_PAGE);
        setHasNextCardPage(false);
        return;
      }

      try {
        setIsCardLoading(true);
        setCards([]);
        setCardPage(DEFAULT_RECRUITING_MEMBERS_PAGE);
        setHasNextCardPage(false);

        const response = await getRecruitingMembers(selectedCourseId, {
          keyword: searchKeyword,
          sort: sortType,
          traits: selectedTraits,
          includeCompleted,
          page: DEFAULT_RECRUITING_MEMBERS_PAGE,
        });

        if (ignore) return;

        const result = response.result || {};
        const courseId = String(result.courseId ?? selectedCourseId);
        const nextCards = (result.content || []).map((card) => ({
          ...card,
          courseId,
        }));

        setCards(nextCards);
        setCardPage(result.page ?? DEFAULT_RECRUITING_MEMBERS_PAGE);
        setHasNextCardPage(Boolean(result.hasNext));
      } catch (error) {
        console.error('[모집 카드 목록 조회 실패]', error.message);
        if (!ignore) {
          setCards([]);
          setHasNextCardPage(false);
        }
      } finally {
        if (!ignore) {
          setIsCardLoading(false);
        }
      }
    };

    loadRecruitCards();

    return () => {
      ignore = true;
    };
  }, [
    selectedCourseId,
    searchKeyword,
    sortType,
    selectedTraits,
    includeCompleted,
    cardQueryKey,
  ]);

  const handleLoadMoreCards = useCallback(async () => {
    if (
      !selectedCourseId
      || isCardLoading
      || isLoadingMoreCardsRef.current
      || !hasNextCardPage
    ) {
      return;
    }

    const requestQueryKey = cardQueryKey;
    const nextPage = cardPage + 1;

    try {
      isLoadingMoreCardsRef.current = true;
      setIsLoadingMoreCards(true);

      const response = await getRecruitingMembers(selectedCourseId, {
        keyword: searchKeyword,
        sort: sortType,
        traits: selectedTraits,
        includeCompleted,
        page: nextPage,
      });

      if (cardQueryKeyRef.current !== requestQueryKey) return;

      const result = response.result || {};
      const courseId = String(result.courseId ?? selectedCourseId);
      const nextCards = (result.content || []).map((card) => ({
        ...card,
        courseId,
      }));

      setCards((prevCards) => {
        const existingCardKeys = new Set(
          prevCards.map((card) => String(getRecruitCardKey(card)))
        );
        const cardsToAppend = nextCards.filter((card) => {
          return !existingCardKeys.has(String(getRecruitCardKey(card)))
        });

        return [...prevCards, ...cardsToAppend];
      });
      setCardPage(result.page ?? nextPage);
      setHasNextCardPage(Boolean(result.hasNext));
    } catch (error) {
      console.error('[모집 카드 추가 조회 실패]', error.message);
    } finally {
      isLoadingMoreCardsRef.current = false;
      setIsLoadingMoreCards(false);
    }
  }, [
    selectedCourseId,
    isCardLoading,
    hasNextCardPage,
    cardQueryKey,
    cardPage,
    searchKeyword,
    sortType,
    selectedTraits,
    includeCompleted,
  ]);

  useEffect(() => {
    const loadMoreTrigger = loadMoreTriggerRef.current;

    if (
      !loadMoreTrigger
      || !hasNextCardPage
      || isCardLoading
      || isLoadingMoreCards
    ) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          handleLoadMoreCards();
        }
      },
      {
        root: null,
        rootMargin: '160px 0px',
        threshold: 0,
      }
    );

    observer.observe(loadMoreTrigger);

    return () => observer.disconnect();
  }, [
    hasNextCardPage,
    isCardLoading,
    isLoadingMoreCards,
    handleLoadMoreCards,
  ]);

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
    // 정렬기준은 성향 유사순으로 초기화
    setTempSortType('match');

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
    const selected = traitFilters.filter((trait) => selectedTraits.includes(trait.title));
    const unselected = traitFilters.filter((trait) => !selectedTraits.includes(trait.title));

    return [...selected, ...unselected];
  }, [selectedTraits, traitFilters]);

  const filteredCards = useMemo(() => {
    return cards.filter((card) => isVisibleRecruitCard(card, includeCompleted));
  }, [
    cards,
    includeCompleted,
  ]);

  const isFilterActive = selectedTraits.length > 0;

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
          {filteredCards.length > 0 ? (
            filteredCards.map((card) => (
              <ProfileCard
                key={getRecruitCardKey(card)}
                variant="recruit"
                user={getRecruitCardUser(card)}
                status={getRecruitCardStatusLabel(card)}
                traits={getRecruitCardTraits(card)}
                importance={getRecruitCardImportance(card)}
                projectSummary={getRecruitCardProjectSummary(card)}
                onChatClick={() => console.log(`${getRecruitCardUser(card).name || '사용자'} 채팅`)}
              />
            ))
          ) : (
            <p className="recruit-card-list__empty">
              {isRecruitLoading || isCardLoading ? '모집 페이지 정보를 불러오는 중입니다.' : '모집 중인 팀원을 찾을 수 없습니다.'}
            </p>
          )}
          {filteredCards.length > 0 && isLoadingMoreCards && (
            <p className="recruit-card-list__loading">
              모집 카드를 불러오는 중입니다.
            </p>
          )}

          {filteredCards.length > 0 && hasNextCardPage && (
            <div
              ref={loadMoreTriggerRef}
              className="recruit-card-list__sentinel"
              aria-hidden="true"
            />
          )}
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
                {traitFilters.map((trait) => (
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
