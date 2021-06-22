import { useSnackbar } from 'notistack'
import { UseQueryOptions, useQuery, useQueryClient, useMutation } from 'react-query'
import { getProjects, uploadProject, deleteProject } from '../requests'
import { ProjectFilters } from '../types'
import { ProjectDTO } from '../types/api'

export const useProjects = (
  filters: ProjectFilters,
  options?: UseQueryOptions<ProjectDTO[]>
) =>
  useQuery(
    ['projects', filters.programme, filters.school, filters.user],
    () => getProjects(filters),
    {
      ...options,
      // sorting projects from newest to oldest
      // this should be done on the back-end, but it's okay for this app
      select: (data: ProjectDTO[]) =>
        data.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ),
    }
  )

export const useNewProject = () => {
  const { enqueueSnackbar } = useSnackbar()
  const queryClient = useQueryClient()

  return useMutation(uploadProject, {
    onSuccess: () => {
      enqueueSnackbar('Project uploaded', { variant: 'success' })
    },
    onError: () => {
      enqueueSnackbar('Cannot upload project', { variant: 'error' })
    },
    onSettled: () => {
      queryClient.invalidateQueries('projects')
    },
  })
}

export const useDeleteProject = () => {
  const { enqueueSnackbar } = useSnackbar()
  const queryClient = useQueryClient()

  return useMutation(deleteProject, {
    onSuccess: () => {
      enqueueSnackbar('Project deleted', { variant: 'success' })
    },
    onError: () => {
      enqueueSnackbar('Cannot delete project', { variant: 'error' })
    },
    onSettled: () => {
      queryClient.invalidateQueries('projects')
    },
  })
}
