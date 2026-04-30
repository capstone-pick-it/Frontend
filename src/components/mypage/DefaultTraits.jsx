import React from 'react';
import Tag from '../Tag';

const DefaultTraits = ({ traits = [], onEdit }) => {
  return (
    <div className="default-traits">

        {/* 헤더 영역 */}
        <div className="traits-header">
            <h2 className="title">기본 팀플 성향</h2>

            <button 
                type="button"
                className="edit-link"
                onClick={onEdit}
            >
                기본 성향 수정
            </button>
        </div>

        {/* 태그 리스트 */}
        <div className="traits-list">
            {traits.map((trait, index) => (
                <Tag key={index} label={trait} />
            ))}
        </div>

    </div>
  );
};

export default DefaultTraits;