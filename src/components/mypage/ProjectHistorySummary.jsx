import React from 'react';
import { useNavigate } from 'react-router-dom';
import TripleStatBox from '../TripleStatBox';

const ProjectHistorySummary = ({ summary }) => {
  const navigate = useNavigate();

  const stats = [
    {
      label: '참여수',
      value: summary?.projectCount ?? 0,
    },
    {
      label: '완수율',
      value: `${summary?.completionRate ?? 0}%`,
    },
    {
      label: '상호평가',
      value: `${summary?.averagePeerReview ?? 0}/${summary?.maxPeerReviewScore ?? 5}`,
    },
  ];

  return (
    <section className="project-history-summary">
      {/* 1. 상단 타이틀 영역 */}
      <div className="project-history-summary__header">

        {/* 타이틀 */}
        <h2 className="project-history-summary__title">프로젝트 이력</h2>

        {/* 자세히 보기 버튼 */}
        <button
          type="button"
          className="project-history-summary__link"
          onClick={() => navigate('/mypage/project-history')}
        >
          자세히 보기
        </button>
      </div>

      {/* 2. 프로젝트 이력 통계 영역 */}
      <TripleStatBox stats={stats} />
    </section>
  );
};

export default ProjectHistorySummary;