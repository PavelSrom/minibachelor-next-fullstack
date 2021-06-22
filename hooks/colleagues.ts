import { useQuery, UseQueryOptions } from 'react-query'
import { getColleagueDetail, getColleagues } from '../requests'
import { UserFilters } from '../types'
import { UserDTO } from '../types/api'

export const useColleagues = (
  filters: UserFilters,
  options?: UseQueryOptions<UserDTO[]>
) =>
  useQuery(
    ['colleagues', filters.id, filters.school, filters.programme, filters.role],
    () => getColleagues(filters),
    options
  )

export const useColleagueDetail = (id: number, options?: UseQueryOptions<UserDTO>) =>
  useQuery(['userDetail', id], () => getColleagueDetail(id), options)
