import React from 'react';
import TripleStatBox from '../TripleStatBox';

const ProjectHistorySummary = ({ summary, onDetail }) => {
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
      {/* 상단 타이틀 영역 */}
      <div className="project-history-summary__header">
        <h2 className="project-history-summary__title">프로젝트 이력</h2>

        <button
          type="button"
          className="project-history-summary__link"
          onClick={onDetail}
        >
          자세히 보기
        </button>
      </div>

      {/* 프로젝트 이력 통계 영역 */}
      <TripleStatBox stats={stats} />
    </section>
  );
};

export default ProjectHistorySummary;