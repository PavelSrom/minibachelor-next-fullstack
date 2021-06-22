import { useSnackbar } from 'notistack'
import { useMutation, useQuery, useQueryClient, UseQueryOptions } from 'react-query'
import { deleteComment, getComments, postComment } from '../requests'
import { CommentFilters } from '../types'
import { CommentDTO } from '../types/api'

export const useComments = (
  filters: CommentFilters,
  options?: UseQueryOptions<CommentDTO[]>
) =>
  useQuery(
    ['comments', filters.questionId, filters.projectId],
    () => getComments(filters),
    options
  )

export const useNewComment = () => {
  const { enqueueSnackbar } = useSnackbar()
  const queryClient = useQueryClient()

  return useMutation(postComment, {
    onSuccess: () => {
      enqueueSnackbar('Comment added', { variant: 'success' })
    },
    onError: () => {
      enqueueSnackbar('Cannot add comment', { variant: 'error' })
    },
    onSettled: (_data, _error, { filters }) => {
      queryClient.invalidateQueries(['comments', filters.questionId, filters.projectId])
    },
  })
}

export const useDeleteComment = () => {
  const { enqueueSnackbar } = useSnackbar()
  const queryClient = useQueryClient()

  return useMutation(deleteComment, {
    onSuccess: () => {
      enqueueSnackbar('Comment deleted', { variant: 'success' })
    },
    onError: () => {
      enqueueSnackbar('Cannot delete comment', { variant: 'error' })
    },
    onSettled: () => {
      queryClient.invalidateQueries('comments')
    },
  })
}
