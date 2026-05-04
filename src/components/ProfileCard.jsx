import React, { useState } from 'react';
import StatBox from './StatBox';
import Modal from './Modal';
import { POINT_HISTORY } from '../data/mockData';

// 이름, 전공, 학년, 레벨, 포인트 데이터속성 받아오기
const ProfileCard = ({ name, major, year, level, points }) => {
    const [isLevelModalOpen, setIsLevelModalOpen] = useState(false);
    const [isPointModalOpen, setIsPointModalOpen] = useState(false);

    return (
    <>
    <div className="profile-card">

        {/* 1. 상단: 회원정보 */}
        <div className="profile-info">

            {/* 이름 텍스트 필드 */}
            <h2 className="user-name">{name}</h2>

            {/* 학과 & 학년 텍스트 필드 */}
            <p className="user-major">{major} {year}학년</p>

        </div>

        {/* 2. 하단: 스탯 박스 (팀플레벨, 포인트) */}
        <div className="profile-stats">

            {/* 팀플레벨 */}
            <div onClick={() => setIsLevelModalOpen(true)}>
                <StatBox 
                    label="팀플레벨" 
                    value={`LV.${level}`} 
                />
            </div>

            {/* 포인트 */}
            <div onClick={() => setIsPointModalOpen(true)}>
                <StatBox 
                    label="포인트" 
                    value={`${points}p`} 
                />
            </div>

        </div>
    </div>

    {/* 팀플레벨 모달 */}
    {isLevelModalOpen && (
        <Modal
            title="팀플레벨"
            titleColor="black"
            onClose={() => setIsLevelModalOpen(false)}
            onConfirm={() => setIsLevelModalOpen(false)}
        >
            <div className="modal__level-info">
                <span className="modal__level-name">Lv.{level}</span>
                <span className="modal__level-score">0/20</span>
            </div>
        </Modal>
      )}

    {/* 포인트 모달 */}
    {isPointModalOpen && (
        <Modal
            title="포인트"
            titleColor="black"
            onClose={() => setIsPointModalOpen(false)}
            onConfirm={() => setIsPointModalOpen(false)}
        >
            <div className="modal__point">

                {/* 현재 포인트 */}
                <div className="modal__point-row">
                    <span className="modal__point-label">현재 보유 포인트</span>
                    <span className="modal__point-value">{points}p</span>
                </div>

                <div className="modal__divider" />

                {/* 스크롤 영역 */}
                <div className="modal__point-history">
                    <span className="modal__point-history-title">내역</span>

                    {POINT_HISTORY.map((item, index) => (
                    <div key={index} className="modal__point-history-row">
                        <span className="modal__point-history-label">{item.label}</span>
                        <span className="modal__point-history-value">{item.value}</span>
                    </div>
                    ))}
                </div>

            </div>
        </Modal>
    )}
    </>
    );
};

export default ProfileCard;