import { useState, useRef } from 'react'
import send from '../../assets/images/Chat/send.svg'
import add from '../../assets/images/Chat/add.svg'
import { uploadFile } from '../../api/chat'

const ALLOWED_EXTENSIONS = /\.(png|jpg|jpeg|webp|pdf|doc|docx|ppt|pptx|xls|xlsx|txt)$/i
const MAX_FILE_COUNT = 5
const MAX_FILE_SIZE = 20 * 1024 * 1024 // 20MB

const ChatRoomInput = ({ sendMessage, isGroup, onFileSent }) => {
  const [text, setText] = useState('')
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)

  const handleSend = () => {
    if (!text.trim()) return
    sendMessage(text.trim())
    setText('')
  }

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files)
    e.target.value = ''
    if (files.length === 0) return

    if (files.length > MAX_FILE_COUNT) {
      alert(`파일은 최대 ${MAX_FILE_COUNT}개까지 업로드할 수 있습니다.`)
      return
    }
    const invalidType = files.find((f) => !ALLOWED_EXTENSIONS.test(f.name))
    if (invalidType) {
      alert(`지원하지 않는 파일 형식입니다: ${invalidType.name}`)
      return
    }
    const oversized = files.find((f) => f.size > MAX_FILE_SIZE)
    if (oversized) {
      alert(`파일 1개당 최대 20MB까지 업로드할 수 있습니다: ${oversized.name}`)
      return
    }

    setUploading(true)
    try {
      const result = await uploadFile(files)
      sendMessage(null, 'FILE', result.files)
      // STOMP 전송 후 서버가 저장·브로드캐스트할 시간을 주고 히스토리 재조회
      setTimeout(() => onFileSent?.(), 1500)
    } catch (err) {
      console.error('파일 업로드 실패', err)
      alert('파일 업로드에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className='ChatRoomInput_Wrap'>
      {isGroup && (
        <button
          className={`add_btn${uploading ? ' uploading' : ''}`}
          onClick={() => !uploading && fileInputRef.current.click()}
          disabled={uploading}
        >
          <img src={add} alt="" />
        </button>
      )}
      <input
        type="text"
        className={isGroup ? 'with-add-btn' : ''}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        placeholder={uploading ? '파일 업로드 중...' : ''}
      />
      <button className="send_btn" onClick={handleSend}>
        <img src={send} alt="" />
      </button>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
        multiple
        accept=".png,.jpg,.jpeg,.webp,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt"
      />
    </div>
  )
}

export default ChatRoomInput