const ChatBadge = ({ count }) => {
  if (!count || count === 0) return null

  return (
    <div id="ChatBadge_Wrap">
        <p>{count}</p>
    </div>
  )
}

export default ChatBadge