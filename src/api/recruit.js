import { request } from './client'
import {
  filterActiveProjectCourses,
  getCourseCards,
  mapCourseCard,
  sortCoursesByCourseNameAsc,
} from './mypage'
import { TRAIT_NAME_ALIASES } from '../constants/commonOptions'

const normalizeTraitName = (traitName) => {
  if (!traitName) return ''

  const trimmedTraitName = String(traitName).trim()

  return TRAIT_NAME_ALIASES[trimmedTraitName] || trimmedTraitName
}

export const DEFAULT_RECRUITING_MEMBERS_PAGE = 0
export const DEFAULT_RECRUITING_MEMBERS_SIZE = 20
export const DEFAULT_RECRUITING_MEMBERS_SORT = 'TRAIT_SIMILARITY_DESC'

const RECRUITING_MEMBER_SORT_BY_UI_VALUE = {
  match: 'TRAIT_SIMILARITY_DESC',
  importance: 'IMPORTANCE_DESC',
  level: 'TEAM_LEVEL_DESC',
  default: 'LATEST',
}

export const toRecruitingMemberSort = (sort) => {
  if (!sort) return DEFAULT_RECRUITING_MEMBERS_SORT

  return RECRUITING_MEMBER_SORT_BY_UI_VALUE[sort] || sort
}

export const toRecruitingMemberQuery = ({
  keyword = '',
  traits = [],
  includeCompleted = false,
  sort = DEFAULT_RECRUITING_MEMBERS_SORT,
  page = DEFAULT_RECRUITING_MEMBERS_PAGE,
  size = DEFAULT_RECRUITING_MEMBERS_SIZE,
} = {}) => {
  const traitValues = Array.isArray(traits) ? traits : [traits].filter(Boolean)
  const query = {
    includeCompleted,
    page,
    size,
  }

  const trimmedKeyword = String(keyword).trim()
  if (trimmedKeyword) {
    query.keyword = trimmedKeyword
  }

  if (traitValues.length > 0) {
    query.traits = traitValues.join(',')
  }

  if (sort) {
    query.sort = toRecruitingMemberSort(sort)
  }

  return query
}

export const getRecruitingMembers = (courseId, filters = {}) => {
  return request(`/api/courses/${courseId}/recruiting-members`, {
    method: 'GET',
    requireAuth: true,
    params: toRecruitingMemberQuery(filters),
  })
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

export const getRecruitCourses = async () => {
  const response = await getCourseCards()
  const courseCards = response.result || []

  return sortCoursesByCourseNameAsc(
    filterActiveProjectCourses(courseCards.map((course) => mapCourseCard(course)))
  ).map((course) => ({
    ...course,
    id: String(course.id),
  }))
}

export const getTraitItems = async () => {
  const response = await request('/api/traits', {
    method: 'GET',
    requireAuth: true,
  })

  return response.result || []
}
