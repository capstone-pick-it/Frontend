// 채팅 리스트용 데이터
export const USERS = [
    { id: 1, name: "김성연", message: "팀 하실래여" },
    { id: 2, name: "이은우", message: "팀원 구하셨어요??" }
];

// 채팅방 상세 대화 데이터 
export const CHAT_MESSAGES = {
    "김성연": [
        { id: 1, text: "승희님 팀원 구하셨어요?", isMe: false },
        { id: 2, text: "아뇹", isMe: true },
        { id: 3, text: "팀 하실래여", isMe: false },
        { id: 4, text: "넵 팀 신청 보낼게요", isMe: true },
    ],
    "이은우": [
        { id: 1, text: "안녕하세요!", isMe: false },
        { id: 2, text: "네 안녕하세요~", isMe: true },
    ]
};

//채팅방 팀요청 상태 데이터
export const TEAM_STATUS = {
    "김성연": "WAITING",   // 팀 요청 전송 후 대기 상태
    "이은우": "REQUEST", // 팀 요청이 온 상태
    "냠": "ACCEPTED"   // 팀원 요청 수락 상태
}

// 회원 정보 데이터
export const USER_INFO = {
    id: "user_123",
    name: '이승희',
    major: '컴퓨터공학과',
    year: 4,
    level: 1,
    points: 100,
};

// 기본 팀플 성향 데이터
export const USER_DEFAULT_TRAITS = ['미리미리', '효율주의', '대면선호', '협업선호', '새벽형인간'];

// 강의 정보 데이터
export const COURSE_TRAITS = [
    {
        id: "course_001",
        name: "캡스톤디자인",
        semester: "2026년도 1학기",
        importance: "높음",
        traits: ['미리미리', '완벽주의', '대면선호', '협업선호', '새벽형인간'],
    },
    {
        id: "course_002",
        name: "클라우드컴퓨팅",
        semester: "2026년도 1학기",
        importance: "보통",
        traits: ['미리미리', '완벽주의', '비대면선호', '협업선호', '아침형인간'],
    },
    {
        id: "course_003",
        name: "소프트웨어디자인패턴",
        semester: "2026년도 1학기",
        importance: "낮음",
        traits: ['벼락치기', '효율주의', '비대면선호', '분담선호', '새벽형인간'],
    }
];

// 프로젝트 이력 요약 데이터
export const PROJECT_HISTORY_SUMMARY = [
    { label: '참여수', value: 3, },
    { label: '완수율', value: '100%', },
    { label: '상호평가', value: '4/5', },
];

//OnboardingInfo 데이터
export const ONBOARDING_INFO_OPTIONS = {
  MAJORS: ["컴퓨터공학과", "서비스디자인공학과"],
  GRADES: [1, 2, 3, 4],
  SEMESTERS: ["2026년 1학기", "2025년 2학기", "2025년 1학기", "2024년 2학기", "2024년 1학기"]
};

//팀플 성향 카드 데이터
export const PREFERENCE =[
    { id: 1, title: "미리미리", content: "미리 준비해서 계획적으로 진행하는 편이에요, 마감 전에 끝내는걸 선호해요"},
    { id: 2, title: "벼락치기", content: "급하지 않게 상황에 맞춰서 진행하는 편이에요, 스케줄에 따라 유연하게 작업해요"},
    { id: 3, title: "효율주의", content: "속도와 실행력을 중시해요, 일단 진행하고 수정하는 스타일이에요"},
    { id: 4, title: "완벽주의", content: "디테일을 중요하게 생각해요, 작은 부분까지 신경쓰는걸 선호해요"},
    { id: 5, title: "대면 선호", content: "직접 만나 소통하는걸 선호해요, 빠르고 명확한 커뮤니케이션이 좋아요"},
    { id: 6, title: "비대면 선호", content: "장소 제약 없는 회의를 선호해요, 온라인 협업으로 효율을 추구해요"},
    { id: 7, title: "협업 선호", content: "함께 시너지를 발휘해 작업하는걸 선호해요, 긴 회의나 잦은 만남도 괜찮아요"},
    { id: 8, title: "분담 선호", content: "함께 진행하는거보단 체계적인 분담 체제를 선호해요, 빠르고 명확한 일처리가 좋아요"},
    { id: 9, title: "아침형 인간", content: "아침 시간을 선호해요, 일찍 자고 일찍 일어나 오전 시간대를 주고 활용해요"},
    { id: 10, title: "새벽형 인간", content: "새벽 시간을 선호해요, 새벽 시간대에 주로 활동하고 집중이 잘돼요"}
]