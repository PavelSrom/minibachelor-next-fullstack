import { useSnackbar } from 'notistack'
import { useMutation, useQuery, useQueryClient, UseQueryOptions } from 'react-query'
import { deleteQuestion, getQuestions, postQuestion } from '../requests'
import { QuestionFilters } from '../types'
import { QuestionDTO } from '../types/api'

export const useQuestions = (
  filters: QuestionFilters,
  options?: UseQueryOptions<QuestionDTO[]>
) =>
  useQuery(
    ['questions', filters.school, filters.programme, filters.user],
    () => getQuestions(filters),
    {
      ...options,
      // sorting questions from newest to oldest
      // this should be done on the back-end, but it's okay for this app
      select: (data: QuestionDTO[]) =>
        data.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ),
    }
  )

export const useNewQuestion = () => {
  const { enqueueSnackbar } = useSnackbar()
  const queryClient = useQueryClient()

  return useMutation(postQuestion, {
    onSuccess: () => {
      enqueueSnackbar('Question posted', { variant: 'success' })
    },
    onError: () => {
      enqueueSnackbar('Cannot post question', { variant: 'error' })
    },
    onSettled: () => {
      queryClient.invalidateQueries('questions')
    },
  })
}

export const useDeleteQuestion = () => {
  const { enqueueSnackbar } = useSnackbar()
  const queryClient = useQueryClient()

  return useMutation(deleteQuestion, {
    onSuccess: () => {
      enqueueSnackbar('Question deleted', { variant: 'success' })
    },
    onError: () => {
      enqueueSnackbar('Cannot delete question', { variant: 'error' })
    },
    onSettled: () => {
      queryClient.invalidateQueries('questions')
    },
  })
}
