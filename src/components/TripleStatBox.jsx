import React from 'react';

const TripleStatBox = ({ stats = [] }) => {
  // 3개의 스탯
  const visibleStats = stats.slice(0, 3);

  return (
    <div className="triple-stat-box">
      <div className="triple-stat-box__content">
        {visibleStats.map((stat, index) => (
          <React.Fragment key={`${stat.label}-${index}`}>
            <div className="triple-stat-box__item">
              <span className="triple-stat-box__label">{stat.label}</span>
              <strong className="triple-stat-box__value">{stat.value}</strong>
            </div>

            {/* 마지막 스탯 뒤에는 경계선을 넣지 않음 */}
            {index < visibleStats.length - 1 && (
              <span className="triple-stat-box__divider" aria-hidden="true" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default TripleStatBox;