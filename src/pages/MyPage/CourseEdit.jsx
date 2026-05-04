import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import TopBar from '../../components/TopBar';
import Input from '../../components/Input';
import Dropdown from '../../components/Dropdown';
import PreferenceCard from '../../components/PreferenceCard';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import Nav from '../../components/Nav';

import { COURSE_TRAITS, PREFERENCE } from '../../data/mockData';

const CourseEdit = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();

  // URL의 courseId와 일치하는 강의 데이터 조회
  const course = COURSE_TRAITS.find((item) => item.id === courseId);

  const [importance, setImportance] = useState(course?.importance || '높음');
  const [selectedTraits, setSelectedTraits] = useState(course?.traits || []);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const normalize = (text) => text.replaceAll(' ', '');

  // 존재하지 않는 courseId로 접근한 경우
  if (!course) {
    return (
      <div className="container course-edit-page">
        <TopBar
          title="강의 수정"
          variant="back"
          onBack={() => navigate('/mypage/courses')}
        />

        <p className="course-edit-page__empty">강의 정보를 찾을 수 없습니다.</p>
      </div>
    );
  }

  const handleTraitClick = (item) => {
    const traitName = normalize(item.title);

    setSelectedTraits((prev) => {
      const isSelected = prev.includes(traitName);

      if (isSelected) {
        return prev.filter((trait) => trait !== traitName);
      }

      return [...prev, traitName];
    });
  };

  const handleSubmit = () => {
    const updatedCourse = {
      id: course.id,
      name: course.name,
      semester: course.semester,
      importance,
      traits: selectedTraits,
    };

    console.log('수정할 강의 데이터:', updatedCourse);

    // 추후 PATCH /me/courses/{courseId} 연동 예정
    navigate('/mypage/courses');
  };

  const handleDeleteConfirm = () => {
    console.log('삭제할 강의 id:', course.id);

    // 추후 삭제 가능 여부 확인 및 DELETE API 연동 예정
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="container course-edit-page">
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
          list={['높음', '보통', '낮음']}
          value={importance}
          onChange={setImportance}
        />

        {/* 팀플 성향 */}
        <section className="course-edit-page__traits">
          <h2 className="course-edit-page__title">팀플 성향</h2>

          <div className="course-edit-page__grid">
            {PREFERENCE.map((item) => {
              const traitName = normalize(item.title);

              return (
                <PreferenceCard
                  key={item.id}
                  title={item.title}
                  content={item.content}
                  selected={selectedTraits.includes(traitName)}
                  onClick={() => handleTraitClick(item)}
                />
              );
            })}
          </div>
        </section>

        <Button
          title="완료"
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
          confirmText="확인"
          onClose={() => setIsDeleteModalOpen(false)}
          onCancel={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  );
};

export default CourseEdit;