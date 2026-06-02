export const MAJOR_OPTIONS = ['컴퓨터공학과', '서비스디자인공학과']

export const GRADE_OPTIONS = [1, 2, 3, 4]

export const SEMESTER_OPTIONS = [
  '2026년도 1학기',
  '2025년도 2학기',
  '2025년도 1학기',
  '2024년도 2학기',
  '2024년도 1학기',
]

export const IMPORTANCE_OPTIONS = ['높음', '보통', '낮음']

export const IMPORTANCE_LABEL_BY_VALUE = {
  HIGH: IMPORTANCE_OPTIONS[0],
  MEDIUM: IMPORTANCE_OPTIONS[1],
  LOW: IMPORTANCE_OPTIONS[2],
}

export const IMPORTANCE_VALUE_BY_LABEL = {
  [IMPORTANCE_OPTIONS[0]]: 'HIGH',
  [IMPORTANCE_OPTIONS[1]]: 'MEDIUM',
  [IMPORTANCE_OPTIONS[2]]: 'LOW',
}

export const IMPORTANCE_SCORE_BY_VALUE = {
  HIGH: 3,
  MEDIUM: 2,
  LOW: 1,
  [IMPORTANCE_OPTIONS[0]]: 3,
  [IMPORTANCE_OPTIONS[1]]: 2,
  [IMPORTANCE_OPTIONS[2]]: 1,
}

export const TRAIT_OPTIONS = [
  {
    id: 1,
    title: '미리미리',
    content: '미리 준비해서 계획적으로 진행하는 편이에요, 마감 전에 끝내는걸 선호해요',
  },
  {
    id: 2,
    title: '벼락치기',
    content: '급하지 않게 상황에 맞춰서 진행하는 편이에요, 스케줄에 따라 유연하게 작업해요',
  },
  {
    id: 3,
    title: '효율주의',
    content: '속도와 실행력을 중시해요, 일단 진행하고 수정하는 스타일이에요',
  },
  {
    id: 4,
    title: '완벽주의',
    content: '디테일을 중요하게 생각해요, 작은 부분까지 신경쓰는걸 선호해요',
  },
  {
    id: 5,
    title: '대면선호',
    content: '직접 만나 소통하는걸 선호해요, 빠르고 명확한 커뮤니케이션이 좋아요',
  },
  {
    id: 6,
    title: '비대면선호',
    content: '장소 제약 없는 회의를 선호해요, 온라인 협업으로 효율을 추구해요',
  },
  {
    id: 7,
    title: '협업선호',
    content: '함께 시너지를 발휘해 작업하는걸 선호해요, 긴 회의나 잦은 만남도 괜찮아요',
  },
  {
    id: 8,
    title: '분담선호',
    content: '함께 진행하는거보단 체계적인 분담 체제를 선호해요, 빠르고 명확한 일처리가 좋아요',
  },
  {
    id: 9,
    title: '아침형',
    content: '아침 시간을 선호해요, 일찍 자고 일찍 일어나 오전 시간대를 주로 활용해요',
  },
  {
    id: 10,
    title: '새벽형',
    content: '새벽 시간을 선호해요, 새벽 시간대에 주로 활동하고 집중이 잘돼요',
  },
]

export const TRAIT_NAME_BY_ITEM_ID = TRAIT_OPTIONS.reduce((traitNameMap, trait) => {
  const traitItemId = Math.ceil(trait.id / 2)
  const selectedType = trait.id % 2 === 1 ? 'A' : 'B'

  return {
    ...traitNameMap,
    [traitItemId]: {
      ...traitNameMap[traitItemId],
      [selectedType]: trait.title,
    },
  }
}, {})

export const TRAIT_NAME_ALIASES = {
  '대면 선호': '대면선호',
  '비대면 선호': '비대면선호',
  '협업 선호': '협업선호',
  '분담 선호': '분담선호',
  '아침형 인간': '아침형',
  '새벽형 인간': '새벽형',
}

export const toDisplayImportance = (importance) => {
  return IMPORTANCE_LABEL_BY_VALUE[importance] || importance || IMPORTANCE_OPTIONS[1]
}

export const normalizeTraitName = (traitName) => {
  if (!traitName) return ''

  const trimmedTraitName = String(traitName).trim()

  return TRAIT_NAME_ALIASES[trimmedTraitName] || trimmedTraitName
}

const getTraitNameByItemId = (traitItemId, selectedSide) => {
  if (!traitItemId || !selectedSide) return ''

  return normalizeTraitName(TRAIT_NAME_BY_ITEM_ID[traitItemId]?.[selectedSide] || '')
}

export const toDisplayTraitName = (trait = {}) => {
  if (!trait) return ''
  if (typeof trait === 'string') return normalizeTraitName(trait)
  if (trait.selectedName) return normalizeTraitName(trait.selectedName)

  const selectedSide = trait.selectedSide || trait.selectedType
  const traitItemId = trait.traitItemId ?? trait.traitItemsId

  if (selectedSide === 'A') {
    return normalizeTraitName(trait.nameA || getTraitNameByItemId(traitItemId, selectedSide))
  }

  if (selectedSide === 'B') {
    return normalizeTraitName(trait.nameB || getTraitNameByItemId(traitItemId, selectedSide))
  }

  return normalizeTraitName(trait.name || trait.title || trait.nameA || trait.nameB || '')
}

export const mapTraitNames = (traits = []) => {
  return traits.map((trait) => toDisplayTraitName(trait)).filter(Boolean)
}
