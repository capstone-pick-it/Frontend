const ChatBadge = ({ count, teamRequest }) => {
  if (!count && !teamRequest) return null

  return (
    <div id="ChatBadge_Wrap">
      {teamRequest && <div className="badge badge-blue" />}
      {count > 0 && <div className="badge badge-red"><p>{count}</p></div>}
    </div>
  )
}

export default ChatBadge