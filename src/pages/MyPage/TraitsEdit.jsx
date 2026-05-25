import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import TopBar from '../../components/TopBar';
import Nav from '../../components/Nav';
import Button from '../../components/Button';
import PreferenceCard from '../../components/PreferenceCard';

import { PREFERENCE } from '../../data/mockData';
import {
  createTraitNameMap,
  getDefaultTraits,
  getTraitItems,
  mapDefaultTraits,
  updateDefaultTraits,
} from '../../api/mypage';

const getTraitPairTitles = (traitTitle) => {
  const selectedTrait = PREFERENCE.find((trait) => trait.title === traitTitle);

  if (!selectedTrait) return [];

  const pairStartIndex = Math.floor((selectedTrait.id - 1) / 2) * 2;

  return PREFERENCE
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
  return PREFERENCE
    .map((preference) => preference.title)
    .filter((traitTitle) => traits.includes(traitTitle));
};

const normalizeTraitSelectionByPair = (selectedTraits = []) => {
  return selectedTraits.reduce((normalizedTraits, traitTitle) => {
    if (!PREFERENCE.some((trait) => trait.title === traitTitle)) {
      return normalizedTraits;
    }

    return selectTraitInPair(normalizedTraits, traitTitle);
  }, []);
};

const TraitsEdit = () => {
  const navigate = useNavigate();

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

  const handleToggleTrait = (traitTitle) => {
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

      await updateDefaultTraits(selectedTraits);

      navigate('/mypage');
    } catch (error) {
      console.log('[기본 성향 수정 실패]', error.message);
      alert(error.message || '기본 성향 수정에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
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
          <Button
            title={isSubmitting ? '저장 중' : '완료'}
            variant="primary"
            onClick={handleSubmit}
          />
        </div>
      </main>

      <Nav />
    </div>
  );
};

export default TraitsEdit;
