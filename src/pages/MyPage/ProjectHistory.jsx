import React, { useEffect, useState } from 'react';

import Nav from '../../components/Nav';
import TopBar from '../../components/TopBar';
import TripleStatBox from '../../components/TripleStatBox';

import {
    getProjectHistoryDetail,
    getProjectHistorySummary,
    mapProjectHistoryDetail,
    mapProjectHistorySummary,
} from '../../api/mypage';

const EMPTY_PROJECT_HISTORY_SUMMARY = {
    projectCount: 0,
    completionRate: 0,
    averagePeerReview: 0,
    maxPeerReviewScore: 5,
};

const ProjectHistoryHeaderStats = ({ summary }) => {
    const stats = [
        { 
            label: '참여 수',
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
        <section className="project-history__header-stats">
            {stats.map((stat) => (
                <div
                    key={stat.label}
                    className="project-history__header-stat"
                >
                    <span className="project-history__header-stat-label">
                        {stat.label}
                    </span>
                    <strong className="project-history__header-stat-value">
                        {stat.value}
                    </strong>
                </div>
            ))}
        </section>
    );
};

const ProjectHistoryItem = ({ project }) => {
    const maxScore = project?.peerReview?.maxScore ?? 5;

    const peerReviewStats = [
        {
            label: '완수율',
            value: `${project?.peerReview?.completion ?? 0}/${maxScore}`,
        },
        {
            label: '적극성',
            value: `${project?.peerReview?.participation ?? 0}/${maxScore}`,
        },
        {
            label: '팀원만족도',
            value: `${project?.peerReview?.satisfaction ?? 0}/${maxScore}`,
        },
    ];

    return (
        <article className="project-history__item">
            <div className="project-history__course-header">
                <h2 className="project-history__course-name">
                    {project.courseName ?? '알 수 없는 강의'}
                </h2>

                <div className="project-history__completion">
                    <span className="project-history__completion-label">
                        완수율
                    </span>
                    <strong className="project-history__completion-value">
                        {project.completionRate}%
                    </strong>
                </div>
            </div>

            <div className="project-history__divider" />

            <div className="project-history__review">
                <h3 className="project-history__review-title">
                    팀원평가
                </h3>

                <TripleStatBox stats={peerReviewStats} />
            </div>
        </article>
    );
};

const ProjectHistory = () => {
    const [summary, setSummary] = useState(EMPTY_PROJECT_HISTORY_SUMMARY);
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        let isMounted = true;

        const loadProjectHistory = async () => {
            const [summaryResult, detailResult] = await Promise.allSettled([
                getProjectHistorySummary(),
                getProjectHistoryDetail(),
            ]);

            if (!isMounted) return;

            if (summaryResult.status === 'fulfilled') {
                setSummary(mapProjectHistorySummary(summaryResult.value.result));
            } else {
                console.log('[프로젝트 이력 요약 조회 실패]', summaryResult.reason.message);
            }

            if (detailResult.status === 'fulfilled') {
                setProjects(mapProjectHistoryDetail(detailResult.value.result));
            } else {
                console.log('[프로젝트 이력 상세 조회 실패]', detailResult.reason.message);
            }
        };

        loadProjectHistory();

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <div className="container has-topbar project-history">
            <TopBar title="프로젝트 이력" variant="back" />

            <div className="project-history__content">
                <ProjectHistoryHeaderStats summary={summary} />

                <div className="project-history__list">
                    {projects.length > 0 ? (
                        projects.map((project) => (
                            <ProjectHistoryItem
                                key={project.id}
                                project={project}
                            />
                        ))
                    ) : (
                        <p className="project-history__empty">
                            프로젝트 이력이 없습니다.
                        </p>
                    )}
                </div>
            </div>

            <Nav />
        </div>
    );
};

export default ProjectHistory;
