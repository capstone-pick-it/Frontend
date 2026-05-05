import React, { useEffect, useState } from 'react';

import Nav from '../../components/Nav';
import TopBar from '../../components/TopBar';
import TripleStatBox from '../../components/TripleStatBox';

import {
    COURSE_INFO,
    PROJECT_HISTORY_SUMMARY,
    PROJECT_HISTORY,
} from '../../data/mockData';

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
    // PROJECT_HISTORY에는 courseId만 있으므로 COURSE_INFO에서 강의 정보를 찾아옴
    const course = COURSE_INFO.find(
        (course) => course.id === project.courseId
    );

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
                    {course?.name ?? '알 수 없는 강의'}
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
    const [summary, setSummary] = useState(PROJECT_HISTORY_SUMMARY);

    // PROJECT_HISTORY 중에서 완료된(COMPLETED) 프로젝트만 필터링
    const [projects, setProjects] = useState(
        PROJECT_HISTORY.filter((project) => project.status === 'COMPLETED')
    );

    useEffect(() => {
        // 추후 실제 API 연동
        // GET /me/project-history/summary
        // GET /me/project-history
    }, []);

    return (
        <div className="container has-topbar project-history">
            <TopBar title="프로젝트 이력" variant="back" />

            <div className="project-history__content">
                <ProjectHistoryHeaderStats summary={summary} />

                <div className="project-history__list">
                    {projects.map((project) => (
                        <ProjectHistoryItem
                            key={project.id}
                            project={project}
                        />
                    ))}
                </div>
            </div>

            <Nav />
        </div>
    );
};

export default ProjectHistory;