import React from 'react'
import check from '../../assets/images/Chat/check.svg'
import check_g from '../../assets/images/Chat/check_g.svg'

const ChatToast = ({ status, onAccept }) => {
    if (!status) return null;

  return (
    <div id="ChatToast_Wrap">
        {status === "WAITING" && (
            <button className="status_btn waiting">
                <img src={check_g} alt="" /> 팀원 요청 대기
            </button>
        )}
        {status === "REQUEST" && (
            <button className="status_btn request" onClick={onAccept}>
                <img src={check} alt="" /> 팀원 요청
            </button>
        )}
        {status === "ACCEPTED" && (
            <button className="status_btn accepted">
                <img src={check_g} alt="" /> 팀원 요청 수락
            </button>
        )}
        {status === "REJECTED" && (
            <button className="status_btn rejected">
                <img src={check_g} alt="" /> 팀원 요청 거절
            </button>
        )}
    </div>
  )
}

export default ChatToast
