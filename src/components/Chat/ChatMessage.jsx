import React from 'react'
import profile from '../../assets/images/Chat/profile.svg'

const isImageName = (name) => /\.(jpg|jpeg|png|gif|webp)$/i.test(name?.split('?')[0])

const renderFile = (url, fileName, key) => {
  const isSignedUrl = url?.startsWith('http')
  if (isImageName(fileName) && isSignedUrl) {
    return <img key={key} src={url} alt={fileName} className="message_image" />
  }
  if (isSignedUrl) {
    return (
      <a key={key} href={url} download={fileName} target="_blank" rel="noreferrer" className="message_file">
        {fileName}
      </a>
    )
  }
  return <span key={key} className="message_file">{fileName}</span>
}

const MessageContent = ({ text, files }) => {
  if (files && files.length > 0) {
    return files.map((file, i) => renderFile(file.fileUrl, file.fileName, i))
  }
  try {
    const parsed = JSON.parse(text)
    if (parsed.url && parsed.fileName) {
      return renderFile(parsed.url, parsed.fileName, 0)
    }
  } catch (e) {}
  return text
}

const ChatMessage = ({ text, files, isMe, sender, unreadCount }) => {
  return (
    <div className={`ChatMessage_Wrap ${isMe ? 'me' : 'other'}`}>
        {!isMe && <img src={profile} alt="" className='chat_profile' />}
        <div className="message_container">
            {!isMe && <p>{sender}</p>}
            <div className="message_row">
                {isMe && unreadCount > 0 && <span className="unread_count">{unreadCount}</span>}
                <div className="message">
                    <MessageContent text={text} files={files} />
                </div>
                {!isMe && unreadCount > 0 && <span className="unread_count">{unreadCount}</span>}
            </div>
        </div>
    </div>
  )
}

export default ChatMessage
