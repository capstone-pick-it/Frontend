import React, { useState } from 'react'

const weekdayLabels = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일']
const weekdayOptions = ['월요일', '화요일', '수요일', '목요일', '금요일', '토요일', '일요일']
const fixedYear = '2026'
const monthOptions = Array.from({ length: 12 }, (_, index) => String(index + 1))

const getDateParts = (item) => {
  const [, textYear, textMonth, textDay] = item.date.match(/(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일/) || []
  const [, dueYear, dueMonth, dueDay] = item.dueAt?.match(/(\d{4})-(\d{2})-(\d{2})/) || []

  return {
    year: textYear || dueYear || '',
    month: textMonth || dueMonth || '',
    day: textDay || dueDay || '',
  }
}

const isValidDateParts = ({ year, month, day }) => {
  const date = new Date(Number(year), Number(month) - 1, Number(day))

  return (
    year.length === 4
    && Number(month) >= 1
    && Number(month) <= 12
    && Number(day) >= 1
    && Number(day) <= 31
    && date.getFullYear() === Number(year)
    && date.getMonth() === Number(month) - 1
    && date.getDate() === Number(day)
  )
}

const getDueAtFromParts = (parts) => {
  if (!isValidDateParts(parts)) {
    return '9999-12-31'
  }

  return `${parts.year}-${parts.month.padStart(2, '0')}-${parts.day.padStart(2, '0')}`
}

const getDateTextFromParts = (parts, weekday) => {
  if (!isValidDateParts(parts)) {
    return '0000년 0월 00일 0요일'
  }

  return `${Number(parts.year)}년 ${Number(parts.month)}월 ${Number(parts.day)}일 ${weekday}`
}

const getWeekdayFromParts = (parts) => {
  if (!isValidDateParts(parts)) {
    return ''
  }

  const date = new Date(Number(parts.year), Number(parts.month) - 1, Number(parts.day))

  return weekdayLabels[date.getDay()]
}

const getDaysInMonth = ({ year, month }) => {
  const safeYear = Number(year || fixedYear)
  const safeMonth = Number(month) >= 1 && Number(month) <= 12 ? Number(month) : 1

  return new Date(safeYear, safeMonth, 0).getDate()
}

const normalizeDateParts = (parts) => {
  const year = fixedYear
  const month = monthOptions.includes(String(Number(parts.month))) ? String(Number(parts.month)) : monthOptions[0]
  const maxDay = getDaysInMonth({ year, month })
  const day = Number(parts.day) >= 1 && Number(parts.day) <= maxDay ? String(Number(parts.day)) : '1'

  return { year, month, day }
}

const getWeekdayFromItem = (item, parts) => {
  const [, weekday] = item.date.match(/\d{1,2}일\s*(\S+)/) || []

  if (weekdayOptions.includes(weekday)) {
    return weekday
  }

  if (!isValidDateParts(parts)) {
    return weekdayOptions[0]
  }

  const calculatedWeekday = getWeekdayFromParts(parts)

  return weekdayOptions.includes(calculatedWeekday) ? calculatedWeekday : weekdayOptions[0]
}

const ChecklistEditModal = ({ canEdit, item, members, onClose, onDelete, onSave }) => {
  const initialDateParts = normalizeDateParts(getDateParts(item))
  const [title, setTitle] = useState(item.title)
  const [dateParts, setDateParts] = useState(initialDateParts)
  const [weekday, setWeekday] = useState(getWeekdayFromItem(item, initialDateParts))
  const [assignee, setAssignee] = useState(item.assignee || members[0]?.name || '')
  const dayOptions = Array.from({ length: getDaysInMonth(dateParts) }, (_, index) => String(index + 1))
  const updateDatePart = (key, value) => {
    setDateParts((parts) => {
      const nextValue = value.replace(/\D/g, '')
      const nextParts = {
        ...parts,
        year: fixedYear,
        [key]: nextValue,
      }

      if (key === 'year' || key === 'month') {
        const maxDay = getDaysInMonth(nextParts)

        if (Number(nextParts.day) > maxDay) {
          nextParts.day = String(maxDay)
        }
      }

      const nextWeekday = getWeekdayFromParts(nextParts)

      if (nextWeekday) {
        setWeekday(nextWeekday)
      }

      return nextParts
    })
  }

  return (
    <div className="home-modal-backdrop">
      <section className="home-checklist-modal">
        <button className="home-checklist-modal__close" type="button" aria-label="닫기" onClick={onClose}>
          ×
        </button>
        <h2>{canEdit ? '할 일 수정' : '할 일 확인'}</h2>
        <label>
          <span>할 일</span>
          <input
            value={title}
            disabled={!canEdit}
            onChange={(event) => setTitle(event.target.value)}
          />
        </label>
        <label>
          <span>기한</span>
          <div className="home-checklist-modal__date">
            <strong>{fixedYear}</strong>
            <em>년</em>
            <select
              value={dateParts.month}
              disabled={!canEdit}
              onChange={(event) => updateDatePart('month', event.target.value)}
              aria-label="기한 월"
            >
              {monthOptions.map((month) => (
                <option value={month} key={month}>
                  {month}
                </option>
              ))}
            </select>
            <em>월</em>
            <select
              value={dateParts.day}
              disabled={!canEdit}
              onChange={(event) => updateDatePart('day', event.target.value)}
              aria-label="기한 일"
            >
              {dayOptions.map((day) => (
                <option value={day} key={day}>
                  {day}
                </option>
              ))}
            </select>
            <em>일</em>
            <div className="home-checklist-modal__weekday-select">
              <select
                value={weekday}
                disabled={!canEdit}
                onChange={(event) => setWeekday(event.target.value)}
                aria-label="기한 요일"
              >
                {weekdayOptions.map((option) => (
                  <option value={option} key={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </label>
        <label>
          <span>담당자</span>
          <div className="home-checklist-modal__select">
            <select
              value={assignee}
              disabled={!canEdit}
              onChange={(event) => setAssignee(event.target.value)}
            >
              {members.map((member) => (
                <option value={member.name} key={member.name}>
                  {member.name}
                </option>
              ))}
            </select>
          </div>
        </label>
        {canEdit && (
          <div className="home-checklist-modal__actions">
            {!item.isNew && (
              <button type="button" onClick={() => onDelete(item.id)}>
                삭제
              </button>
            )}
            <button
              type="button"
              onClick={() => onSave({
                ...item,
                title: title.trim() || '새로운 할 일',
                date: getDateTextFromParts(dateParts, weekday),
                dueAt: getDueAtFromParts(dateParts),
                assignee,
              })}
            >
              {item.isNew ? '생성하기' : '수정'}
            </button>
          </div>
        )}
      </section>
    </div>
  )
}

export default ChecklistEditModal
