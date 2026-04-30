import React from 'react'
import check from '../../assets/images/Chat/check.svg'
import check_g from '../../assets/images/Chat/check_g.svg'
import { TEAM_STATUS } from '../../data/mockData'
import { useParams } from 'react-router-dom'
import { useState } from 'react'
import { useEffect } from 'react'

const ChatToast = () => {
    const { roomId } = useParams();
    const status = TEAM_STATUS[roomId];

    //status별로 상태값 변경 로직 (ACCEPTED 일떄, 토스트 사라짐)
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        if(status === "ACCEPTED"){
            const timer = setTimeout(() => {
                setVisible(false);
            }, 2000)
        return () => clearTimeout(timer);
        }else{
            setVisible(true)
        }
    }, [status])

    if(!status || !visible)
        return null;

  return (
    <div id="ChatToast_Wrap">
        {status === "WAITING" && (
            <button className="status_btn waiting">
                <img src={check_g} alt="" /> 팀원 요청 대기
            </button>
        )}
        {status === "REQUEST" && (
            <button className="status_btn request">
                <img src={check} alt="" /> 팀원 요청
            </button>
        )}
        {status === "ACCEPTED" && (
            <button className="status_btn accepted">
                <img src={check_g} alt="" /> 팀원 요청 수락
            </button>
        )}
    </div>
  )
}

export default ChatToast