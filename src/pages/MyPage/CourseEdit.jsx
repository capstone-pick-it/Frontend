import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import TopBar from '../../components/TopBar';
import Input from '../../components/Input';
import Dropdown from '../../components/Dropdown';
import PreferenceCard from '../../components/PreferenceCard';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import Nav from '../../components/Nav';

import {
  IMPORTANCE_OPTIONS,
  TRAIT_OPTIONS,
} from '../../constants/commonOptions';
import {
  createTraitNameMap,
  deleteCourse,
  filterActiveProjectCourses,
  getCourseCards,
  getTraitItems,
  mapCourseCard,
  updateCourse,
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

const getCourseDeleteErrorMessage = (error) => {
  const deleteBlockedStatusCodes = [400, 403, 409];

  if (deleteBlockedStatusCodes.includes(Number(error?.status))) {
    return '이미 해당 강의 카드로 구성된 팀이 있어요.\n구성된 팀이 없는 경우에만 삭제가 가능해요.';
  }

  return error?.message || '강의 삭제에 실패했습니다. 잠시 후 다시 시도해주세요.';
};

const CourseEdit = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();

  const [course, setCourse] = useState(null);
  const [importance, setImportance] = useState(IMPORTANCE_OPTIONS[0]);
  const [selectedTraits, setSelectedTraits] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteErrorMessage, setDeleteErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadCourse = async () => {
      try {
        const [courseCardsResult, traitItemsResult] = await Promise.allSettled([
          getCourseCards(),
          getTraitItems(),
        ]);

        if (courseCardsResult.status === 'rejected') {
          throw courseCardsResult.reason;
        }

        if (traitItemsResult.status === 'rejected') {
          console.log('[성향 항목 조회 실패]', traitItemsResult.reason.message);
        }

        const traitNameMap = traitItemsResult.status === 'fulfilled'
          ? createTraitNameMap(traitItemsResult.value.result || [])
          : undefined;

        const activeCourses = filterActiveProjectCourses(
          (courseCardsResult.value.result || [])
            .map((courseItem) => mapCourseCard(courseItem, traitNameMap))
        );

        const apiCourse = activeCourses.find((item) => String(item.id) === String(courseId));

        if (!isMounted) return;

        if (apiCourse) {
          setCourse(apiCourse);
          setImportance(apiCourse.importance || IMPORTANCE_OPTIONS[0]);
          setSelectedTraits(normalizeTraitSelectionByPair(apiCourse.traits));
        } else {
          setCourse(null);
        }
      } catch (error) {
        console.log('[강의 상세 조회 실패]', error.message);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadCourse();

    return () => {
      isMounted = false;
    };
  }, [courseId]);

  if (isLoading && !course) {
    return (
      <div className="container has-topbar course-edit-page">
        <TopBar
          title="강의 수정"
          variant="back"
          onBack={() => navigate('/mypage/courses')}
        />

        <p className="course-edit-page__empty">강의 정보를 불러오는 중입니다.</p>

        <Nav />
      </div>
    );
  }

  // 존재하지 않는 courseId로 접근한 경우
  if (!course) {
    return (
      <div className="container has-topbar course-edit-page">
        <TopBar
          title="강의 수정"
          variant="back"
          onBack={() => navigate('/mypage/courses')}
        />

        <p className="course-edit-page__empty">강의 정보를 찾을 수 없습니다.</p>

        <Nav />
      </div>
    );
  }

  const handleTraitClick = (traitTitle) => {
    setSelectedTraits((prev) => selectTraitInPair(prev, traitTitle));
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    if (selectedTraits.length < 5) {
      alert('각 성향 세트마다 하나씩 선택해주세요.');
      return;
    }

    try {
      setIsSubmitting(true);

      await updateCourse(course.id, {
        importance,
        traits: selectedTraits,
      });

      navigate('/mypage/courses');
    } catch (error) {
      console.log('[강의 수정 실패]', error.message);
      alert(error.message || '강의 수정에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (isDeleting) return;

    try {
      setIsDeleting(true);

      await deleteCourse(course.id);

      setIsDeleteModalOpen(false);
      navigate('/mypage/courses', {
        state: {
          deletedCourseName: course.name,
        },
      });
    } catch (error) {
      console.log('[강의 삭제 실패]', error.message);
      setIsDeleteModalOpen(false);
      setDeleteErrorMessage(getCourseDeleteErrorMessage(error));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="container has-topbar course-edit-page">
      <TopBar
        title="강의 수정"
        variant="back"
        onBack={() => navigate('/mypage/courses')}
      />

      <main className="course-edit-page__content">
        {/* 비활성화 */}
        <Input
          title="강의명"
          value={course.name}
          disabled
        />

        {/* 비활성화 */}
        <Input
          title="수강학기"
          value={course.semester}
          disabled
        />

        <Dropdown
          title="중요도"
          list={IMPORTANCE_OPTIONS}
          value={importance}
          onChange={setImportance}
        />

        {/* 팀플 성향 */}
        <section className="course-edit-page__traits">
          <h2 className="course-edit-page__title">팀플 성향</h2>

          <div className="course-edit-page__grid">
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

        <Button
          title={isSubmitting ? '저장 중' : '완료'}
          onClick={handleSubmit}
          className="course-edit-page__button"
        />

        {/* 강의 삭제 영역 */}
        <section className="course-edit-page__delete-area">
          <p className="course-edit-page__delete-text">
            강의 카드를 삭제하시겠어요?<br />
            구성된 팀이 없는 경우에만 삭제가 가능해요.
          </p>

          <button
            type="button"
            className="course-edit-page__delete-btn"
            onClick={() => setIsDeleteModalOpen(true)}
          >
            삭제하기
          </button>
        </section>
      </main>

      <Nav />

      {/* 강의 삭제 확인 모달 */}
      {isDeleteModalOpen && (
        <Modal
          type="error"
          variant="confirm"
          title="강의 삭제"
          description={
            <>
              정말 해당 강의를 삭제하시겠어요?<br />
              한 번 삭제된 강의는 되돌릴 수 없어요.
            </>
          }
          cancelText="취소"
          confirmText={isDeleting ? '삭제 중' : '확인'}
          onClose={() => setIsDeleteModalOpen(false)}
          onCancel={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteConfirm}
        />
      )}

      {deleteErrorMessage && (
        <Modal
          type="error"
          title="강의 삭제 불가"
          confirmText="확인"
          onClose={() => setDeleteErrorMessage('')}
          onConfirm={() => setDeleteErrorMessage('')}
        >
          <p className="modal__description">
            {deleteErrorMessage.split('\n').map((line) => (
              <React.Fragment key={line}>
                {line}
                <br />
              </React.Fragment>
            ))}
          </p>
        </Modal>
      )}
    </div>
  );
};

export default CourseEdit;
