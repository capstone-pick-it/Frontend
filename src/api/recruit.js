import { request } from './client'

const IMPORTANCE_LEVEL_LABEL = {
  HIGH: '높음',
  MEDIUM: '보통',
  LOW: '낮음',
}

const RECRUITMENT_STATUS_LABEL = {
  RECRUITING: '모집 중',
  CONFIRM_PENDING: '확정 대기',
  RECRUITMENT_COMPLETED: '모집 완료',
}

const formatSemester = (semester) => {
  if (!semester) return ''

  const match = String(semester).match(/^(\d{4})-(\d)$/)
  if (!match) return semester

  return `${match[1]}년도 ${match[2]}학기`
}

const TRAIT_NAME_ALIASES = {
  '대면 선호': '대면선호',
  '비대면 선호': '비대면선호',
  '협업 선호': '협업선호',
  '분담 선호': '분담선호',
  '아침형 인간': '아침형',
  '새벽형 인간': '새벽형',
}

const normalizeTraitName = (traitName) => {
  if (!traitName) return ''

  const trimmedTraitName = String(traitName).trim()

  return TRAIT_NAME_ALIASES[trimmedTraitName] || trimmedTraitName
}

export const toRecruitCourse = (profile) => {
  const courseId = profile?.courseId
  const profileId = profile?.userCourseProfileId
  const recruitmentStatus = profile?.recruitmentStatus

  return {
    id: String(courseId ?? profileId ?? ''),
    profileId: profileId ? String(profileId) : '',
    name: profile?.courseName || '강의명 없음',
    semester: formatSemester(profile?.semester),
    importance: IMPORTANCE_LEVEL_LABEL[profile?.importanceLevel] || profile?.importanceLevel || '',
    importanceLevel: profile?.importanceLevel || '',
    recruitmentStatus: recruitmentStatus || '',
    status: RECRUITMENT_STATUS_LABEL[recruitmentStatus] || recruitmentStatus || '',
    projectStatus: recruitmentStatus === 'RECRUITMENT_COMPLETED' ? 'COMPLETED' : 'ONGOING',
  }
}

export const toTraitFilters = (traitItems = []) => {
  return traitItems.flatMap((traitItem) => {
    const traitItemsId = traitItem?.traitItemsId

    return [
      {
        id: `${traitItemsId}-A`,
        traitItemsId,
        selectedSide: 'A',
        title: normalizeTraitName(traitItem?.nameA),
      },
      {
        id: `${traitItemsId}-B`,
        traitItemsId,
        selectedSide: 'B',
        title: normalizeTraitName(traitItem?.nameB),
      },
    ].filter((trait) => trait.traitItemsId && trait.title)
  })
}

export const getRecruitProfiles = async () => {
  const response = await request('/api/courses/profiles', {
    method: 'GET',
    requireAuth: true,
  })

  return response.result || []
}

export const getRecruitProfile = async (userCourseProfileId) => {
  const response = await request(`/api/courses/profiles/${userCourseProfileId}`, {
    method: 'GET',
    requireAuth: true,
  })

  return response.result || null
}

export const getTraitItems = async () => {
  const response = await request('/api/traits', {
    method: 'GET',
    requireAuth: true,
  })

  return response.result || []
}
