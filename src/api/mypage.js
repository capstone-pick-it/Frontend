import { request } from './client'

export const getMyProfile = () => {
  return request('/api/users/me/profile', {
    method: 'GET',
    requireAuth: true,
  })
}

export const getMyTeamLevel = () => {
  return request('/api/users/me/team-level', {
    method: 'GET',
    requireAuth: true,
  })
}

export const getMyPoints = () => {
  return request('/api/me/points', {
    method: 'GET',
    requireAuth: true,
  })
}

export const getCourseCards = () => {
  return request('/api/users/me/courses/card', {
    method: 'GET',
    requireAuth: true,
  })
}

export const getCourseList = () => {
  return request('/api/users/me/courses', {
    method: 'GET',
    requireAuth: true,
  })
}

export const getDefaultTraits = () => {
  return request('/api/users/me/traits/default', {
    method: 'GET',
    requireAuth: true,
  })
}

export const getProjectHistorySummary = () => {
  return request('/api/users/me/project-history/summary', {
    method: 'GET',
    requireAuth: true,
  })
}

export const getProjectHistoryDetail = () => {
  return request('/api/users/me/project-history', {
    method: 'GET',
    requireAuth: true,
  })
}

export const getTraitItems = () => {
  return request('/api/traits', {
    method: 'GET',
    requireAuth: true,
  })
}

export const toDisplayImportance = (importance) => {
  const importanceMap = {
    HIGH: '높음',
    MEDIUM: '보통',
    LOW: '낮음',
  }

  return importanceMap[importance] || importance || '보통'
}

export const toDisplaySemester = (semester) => {
  if (!semester) return ''

  const match = String(semester).match(/^(\d{4})-(1|2)$/)

  if (!match) return semester

  return `${match[1]}년도 ${match[2]}학기`
}

const TRAIT_NAME_BY_ITEM_ID = {
  1: { A: '미리미리', B: '벼락치기' },
  2: { A: '효율주의', B: '완벽주의' },
  3: { A: '대면선호', B: '비대면선호' },
  4: { A: '협업선호', B: '분담선호' },
  5: { A: '아침형', B: '새벽형' },
}

const TRAIT_NAME_ALIASES = {
  '대면 선호': '대면선호',
  '비대면 선호': '비대면선호',
  '협업 선호': '협업선호',
  '분담 선호': '분담선호',
  '아침형 인간': '아침형',
  '새벽형 인간': '새벽형',
}

export const normalizeTraitName = (traitName) => {
  if (!traitName) return ''

  const trimmedTraitName = String(traitName).trim()

  return TRAIT_NAME_ALIASES[trimmedTraitName] || trimmedTraitName
}

export const createTraitNameMap = (traitItems = []) => {
  const traitNameMap = new Map()

  traitItems.forEach((traitItem) => {
    const traitItemId = traitItem.traitItemId ?? traitItem.traitItemsId

    if (!traitItemId) return

    traitNameMap.set(Number(traitItemId), {
      A: normalizeTraitName(traitItem.nameA),
      B: normalizeTraitName(traitItem.nameB),
    })
  })

  return traitNameMap
}

const getTraitNameByItemId = (traitItemId, selectedSide, traitNameMap) => {
  if (!traitItemId || !selectedSide) return ''

  const dynamicTraitNames = traitNameMap?.get(Number(traitItemId))
  const fallbackTraitNames = TRAIT_NAME_BY_ITEM_ID[traitItemId]

  return normalizeTraitName(dynamicTraitNames?.[selectedSide] || fallbackTraitNames?.[selectedSide] || '')
}

export const toDisplayTraitName = (trait = {}, traitNameMap) => {
  if (!trait) return ''
  if (typeof trait === 'string') return normalizeTraitName(trait)
  if (trait.selectedName) return normalizeTraitName(trait.selectedName)

  const selectedSide = trait.selectedSide || trait.selectedType
  const traitItemId = trait.traitItemId ?? trait.traitItemsId

  if (selectedSide === 'A') {
    return normalizeTraitName(trait.nameA || getTraitNameByItemId(traitItemId, selectedSide, traitNameMap))
  }

  if (selectedSide === 'B') {
    return normalizeTraitName(trait.nameB || getTraitNameByItemId(traitItemId, selectedSide, traitNameMap))
  }

  return normalizeTraitName(trait.name || trait.title || trait.nameA || trait.nameB || '')
}

export const mapTraitNames = (traits = [], traitNameMap) => {
  return traits.map((trait) => toDisplayTraitName(trait, traitNameMap)).filter(Boolean)
}

export const mapDefaultTraits = (traits = [], traitNameMap) => {
  return mapTraitNames(traits, traitNameMap)
}

export const mapCourseCard = (course, traitNameMap) => ({
  id: course.courseId,
  name: course.courseName,
  semester: toDisplaySemester(course.semester),
  importance: toDisplayImportance(course.importance),
  traits: mapTraitNames(course.traits, traitNameMap),
  projectStatus: 'ONGOING',
})

export const mapCourseListItem = (course) => ({
  id: course.courseId,
  name: course.courseName,
  projectStatus: 'ONGOING',
})

export const mapProjectHistorySummary = (summary) => ({
  projectCount: summary?.projectCount ?? 0,
  completionRate: summary?.averageScore ?? 0,
  averagePeerReview: summary?.averageContribution ?? 0,
  maxPeerReviewScore: 5,
})

export const mapProjectHistoryDetail = (detail) => {
  return (detail?.projects || []).map((project, index) => ({
    id: `${project.projectName || 'project'}-${index}`,
    courseName: project.projectName,
    completionRate: project.completionRate ?? 0,
    status: 'COMPLETED',
    peerReview: {
      completion: project.teamEvaluation?.completion ?? 0,
      participation: project.teamEvaluation?.activeness ?? 0,
      satisfaction: project.teamEvaluation?.teamSatisfaction ?? 0,
      maxScore: 5,
    },
  }))
}

export const mapProfile = (profile = {}) => {
  const profileFields = {
    name: profile.nickname ?? profile.name,
    major: profile.major,
    year: profile.grade ?? profile.year,
    level: profile.teamLevel ?? profile.level,
  }

  return Object.fromEntries(
    Object.entries(profileFields).filter(([, value]) => value !== undefined && value !== null && value !== '')
  )
}
