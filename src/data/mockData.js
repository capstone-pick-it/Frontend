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