import React, { useState } from 'react';
import StatBox from './StatBox';
import TripleStatBox from './TripleStatBox';
import Tag from './Tag';
import Button from './Button';
import Modal from './Modal';
import { POINT_HISTORY } from '../data/mockData';

import moreIcon from '../assets/images/more1.svg';

// 이름, 전공, 학년, 레벨, 포인트 데이터 속성 받아오기
// variant 값에 따라 마이페이지, 온보딩, 홈, 모집 페이지에서 공통으로 사용
const ProfileCard = ({
    variant = 'mypage',

    name,
    major,
    year,
    level,
    points,

    // 목업데이터 user 객체
    user,

    // 모집 상태, 성향 태그, 중요도
    status = '모집 중',
    traits = [],
    importance = '높음',

    // 프로젝트 이력 요약
    projectSummary,

    // 홈 프로젝트 워크스페이스용 팀원 순서
    memberIndex = 1,
    memberTotal = 1,

    // 마이페이지에서만 본인 스탯 상세 모달 사용
    enableStatModal = false,

    // 모집 페이지에서 카드 기본 펼침 여부
    defaultExpanded = false,

    // 홈, 모집 페이지 액션
    onChatClick,
    onReportClick,
}) => {
    const [isExpanded, setIsExpanded] = useState(defaultExpanded);
    const [isLevelModalOpen, setIsLevelModalOpen] = useState(false);
    const [isPointModalOpen, setIsPointModalOpen] = useState(false);

    const isMypage = variant === 'mypage';
    const isOnboarding = variant === 'onboarding';
    const isRecruitPage = variant === 'recruit';
    const isWorkspace = variant === 'workspace';

    // user 객체가 있으면 user 값을 우선 사용
    const displayName = user?.name ?? name;
    const displayMajor = user?.major ?? major;
    const displayYear = user?.year ?? year;
    const displayLevel = user?.level ?? level;
    const displayPoints = user?.points ?? points;

    // 페이지별 노출 여부
    const showRecruitStatus = !isMypage;
    const showTraits = !isMypage;
    const showImportance = !isMypage;
    const showMemberCount = isWorkspace;
    const showActions = isWorkspace;
    const showToggle = isRecruitPage;

    // 모집 페이지에서는 모집상태 태그 스타일만 다르게 사용
    const recruitTagVariant = isRecruitPage ? 'recruit-page' : 'recruit-default';

    const handleLevelClick = () => {
        if (!enableStatModal) return;
        setIsLevelModalOpen(true);
    };

    const handlePointClick = () => {
        if (!enableStatModal) return;
        setIsPointModalOpen(true);
    };

    const profileStats = [
        { label: '팀플레벨', value: `LV.${displayLevel}` },
        { label: '포인트', value: `${displayPoints}p` },
        { label: '중요도', value: importance },
    ];

    const projectStats = projectSummary
        ? [
            { label: '참여수', value: projectSummary.projectCount },
            { label: '완수율', value: `${projectSummary.completionRate}%` },
            {
                label: '상호평가',
                value: `${projectSummary.averagePeerReview}/${projectSummary.maxPeerReviewScore}`,
            },
        ]
        : [];

    const workspaceDots = Array.from({ length: memberTotal }, (_, index) => index + 1);

    const MAX_VISIBLE_RECRUIT_TRAITS = 4;

    const shouldCollapseTraits = isRecruitPage && !isExpanded;

    const visibleTraits = shouldCollapseTraits
        ? traits.slice(0, MAX_VISIBLE_RECRUIT_TRAITS)
        : traits;

    const hiddenTraitCount =
        shouldCollapseTraits && traits.length > MAX_VISIBLE_RECRUIT_TRAITS
            ? traits.length - MAX_VISIBLE_RECRUIT_TRAITS
            : 0;
    
    return (
        <>
            <div className={`profile-card profile-card--${variant} ${isExpanded ? 'is-expanded' : ''}`}>

                {/* 내부 컨텐츠 영역 */}
                <div className="profile-card__content">

                    {/* 1. 상단: 회원정보 */}
                    <div className="profile-card__header">

                        <div className="profile-card__info">

                            {/* 이름, 모집상태 태그 */}
                            <div className="profile-card__name-row">
                                <h2 className="profile-card__name">{displayName}</h2>

                                {/* 모집 페이지는 이름 옆에 모집상태 태그 표시 */}
                                {showRecruitStatus && !isOnboarding && (
                                    <Tag label={status} variant={recruitTagVariant} />
                                )}
                            </div>

                            {/* 학과 & 학년 텍스트 필드 */}
                            <p className="profile-card__major">
                                {displayMajor} {displayYear}학년
                            </p>

                            {/* 성향 태그 */}
                            {showTraits && (
                                <div className="profile-card__traits">
                                    {visibleTraits.map((trait) => (
                                        <Tag key={trait} label={trait} />
                                    ))}

                                    {hiddenTraitCount > 0 && (
                                        <Tag label={`+${hiddenTraitCount}`} />
                                    )}
                                </div>
                            )}

                        </div>

                        {/* 온보딩: 모집상태 태그는 오른쪽 상단에 표시 */}
                        {isOnboarding && showRecruitStatus && (
                            <Tag label={status} variant="recruit-default" />
                        )}

                        {/* 홈: 현재 카드 순서 / 전체 팀원 수 */}
                        {showMemberCount && (
                            <span className="profile-card__member-count">
                                {memberIndex}/{memberTotal}
                            </span>
                        )}

                        {/* 모집 페이지: 펼치기 / 닫기 버튼 */}
                        {showToggle && (
                            <button
                                type="button"
                                className="profile-card__toggle"
                                onClick={() => setIsExpanded((prev) => !prev)}
                                aria-label={isExpanded ? '프로필 접기' : '프로필 펼치기'}
                                aria-expanded={isExpanded}
                            >
                                <img
                                    src={moreIcon}
                                    alt=""
                                    className={isExpanded ? 'open' : ''}
                                    aria-hidden="true"
                                />
                            </button>
                        )}
                    </div>

                    {/* 2. 스탯 영역 */}
                    {isRecruitPage ? (
                        // 조건부 렌더링X 항상 렌더링O: CSS transition 자연스럽게 적용
                        <div
                            className={`profile-card__recruit-detail ${isExpanded ? 'is-open' : ''}`}
                            aria-hidden={!isExpanded}
                        >
                            <TripleStatBox stats={profileStats} />

                            {projectStats.length > 0 && (
                                <TripleStatBox stats={projectStats} />
                            )}

                            <Button
                                variant="chat-full"
                                onClick={onChatClick}
                            />
                        </div>
                    ) : (
                        <div className={`profile-card__stats ${enableStatModal ? 'clickable' : ''}`}>

                            {/* 팀플레벨 */}
                            <div onClick={handleLevelClick}>
                                <StatBox
                                    label="팀플레벨"
                                    value={`LV.${displayLevel}`}
                                />
                            </div>

                            {/* 포인트 */}
                            <div onClick={handlePointClick}>
                                <StatBox
                                    label="포인트"
                                    value={`${displayPoints}p`}
                                />
                            </div>

                            {/* 온보딩, 홈에서 사용하는 중요도 */}
                            {showImportance && (
                                <div>
                                    <StatBox
                                        label="중요도"
                                        value={importance}
                                    />
                                </div>
                            )}

                        </div>
                    )}

                    {/* 3. 홈 프로젝트 워크스페이스: 채팅 / 신고 버튼 */}
                    {showActions && (
                        <div className="profile-card__actions">
                            <Button
                                variant="chat"
                                onClick={onChatClick}
                            />

                            <Button
                                variant="report"
                                onClick={onReportClick}
                            />
                        </div>
                    )}

                    {/* 4. 홈 프로젝트 워크스페이스: 팀원 순서 dot */}
                    {isWorkspace && (
                        <div className="profile-card__dots">
                            {workspaceDots.map((dot) => (
                                <span
                                    key={dot}
                                    className={`profile-card__dot ${dot === memberIndex ? 'active' : ''}`}
                                    aria-hidden="true"
                                />
                            ))}
                        </div>
                    )}

                </div>
            </div>

            {/* 팀플레벨 모달 */}
            {enableStatModal && isLevelModalOpen && (
                <Modal
                    title="팀플레벨"
                    titleColor="black"
                    onClose={() => setIsLevelModalOpen(false)}
                    onConfirm={() => setIsLevelModalOpen(false)}
                >
                    <div className="modal__level-info">
                        <span className="modal__level-name">Lv.{displayLevel}</span>
                        <span className="modal__level-score">0/20</span>
                    </div>
                </Modal>
            )}

            {/* 포인트 모달 */}
            {enableStatModal && isPointModalOpen && (
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
                            <span className="modal__point-value">{displayPoints}p</span>
                        </div>

                        <div className="modal__divider" />

                        {/* 스크롤 영역 */}
                        <div className="modal__point-history">
                            <span className="modal__point-history-title">내역</span>

                            {POINT_HISTORY.map((item) => (
                                <div key={item.id} className="modal__point-history-row">
                                    <span className="modal__point-history-label">{item.label}</span>
                                    <span className="modal__point-history-value">
                                        {item.type === 'EARNED'
                                            ? `+${item.value}p`
                                            : `-${item.value}p`}
                                    </span>
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