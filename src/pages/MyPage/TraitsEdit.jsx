import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import TopBar from '../../components/TopBar';
import Nav from '../../components/Nav';
import Button from '../../components/Button';
import PreferenceCard from '../../components/PreferenceCard';

import {
  PREFERENCE,
  USER_DEFAULT_TRAITS,
} from '../../data/mockData';

const TraitsEdit = () => {
  const navigate = useNavigate();

  // 초기값 mockData로 설정
  const [selectedTraits, setSelectedTraits] = useState(USER_DEFAULT_TRAITS);

  useEffect(() => {
    // API 연동 예정
  }, []);

  const handleToggleTrait = (traitTitle) => {
    setSelectedTraits((prev) =>
      prev.includes(traitTitle)
        ? prev.filter((trait) => trait !== traitTitle)
        : [...prev, traitTitle]
    );
  };

  const handleSubmit = () => {
    // 추후 API 연동 예정
    console.log('선택된 기본 성향:', selectedTraits);
    navigate('/mypage');
  };

  return (
    <div className="container has-topbar traits-edit-container">
      <TopBar title="기본 성향 수정" variant="back" />

      <main className="traits-edit">
        <section className="traits-edit__traits">
          <div className="traits-edit__header">
            <h2 className="traits-edit__title">팀플 성향</h2>

            <p className="traits-edit__description">
              기본 팀플 성향은 강의 추가 페이지에서 카드를 생성할 때 먼저 적용돼요.
              <br />
              강의별로 세부적인 팀플 성향을 바꿀 수 있어요.
              <br />
              가장 나와 가까운 성향을 선택해볼까요?
            </p>
          </div>

          <div className="traits-edit__grid">
            {PREFERENCE.map((trait) => (
              <PreferenceCard
                key={trait.id}
                title={trait.title}
                content={trait.content}
                selected={selectedTraits.includes(trait.title)}
                onClick={() => handleToggleTrait(trait.title)}
              />
            ))}
          </div>
        </section>

        <div className="traits-edit__button">
          <Button title="완료" variant="primary" onClick={handleSubmit} />
        </div>
      </main>

      <Nav />
    </div>
  );
};

export default TraitsEdit;