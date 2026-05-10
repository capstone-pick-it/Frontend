import React, { useState } from 'react'

const getDueAtFromDateText = (dateText) => {
  const [, year, month, day] = dateText.match(/(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일/) || []

  if (!year || !month || !day) {
    return '9999-12-31'
  }

  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
}

const ChecklistEditModal = ({ item, members, onClose, onSave }) => {
  const [title, setTitle] = useState(item.title)
  const [date, setDate] = useState(item.date)
  const [assignee, setAssignee] = useState(item.assignee || members[0]?.name || '')

  return (
    <div className="home-modal-backdrop">
      <section className="home-checklist-modal">
        <h2>할 일 수정</h2>
        <label>
          <span>할 일</span>
          <input value={title} onChange={(event) => setTitle(event.target.value)} />
        </label>
        <label>
          <span>기한</span>
          <input value={date} onChange={(event) => setDate(event.target.value)} />
        </label>
        <label>
          <span>담당자</span>
          <select value={assignee} onChange={(event) => setAssignee(event.target.value)}>
            {members.map((member) => (
              <option value={member.name} key={member.name}>
                {member.name}
              </option>
            ))}
          </select>
        </label>
        <div>
          <button type="button" onClick={onClose}>취소</button>
          <button
            type="button"
            onClick={() => onSave({
              ...item,
              title: title.trim() || '새로운 할 일',
              date: date.trim() || '0000년 0월 00일 0요일',
              dueAt: getDueAtFromDateText(date.trim()),
              assignee,
            })}
          >
            저장
          </button>
        </div>
      </section>
    </div>
  )
}

export default ChecklistEditModal
