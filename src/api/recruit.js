import { request } from './client'
import {
  getCourseCards,
  mapCourseCard,
  sortCoursesByCourseNameAsc,
} from './mypage'

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

export const DEFAULT_RECRUITING_MEMBERS_PAGE = 0
export const DEFAULT_RECRUITING_MEMBERS_SIZE = 20

export const toRecruitingMemberQuery = ({
  keyword = '',
  traits = [],
  includeCompleted = false,
  sort,
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
    query.sort = sort
  }

  return query
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

  return sortCoursesByCourseNameAsc(courseCards.map((course) => mapCourseCard(course))).map((course) => ({
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
