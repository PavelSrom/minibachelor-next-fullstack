import { useState } from 'react'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import { Formik, Form, FormikHelpers } from 'formik'
import Delete from '@material-ui/icons/Delete'
import { Avatar, IconButton, Tooltip } from '@material-ui/core'
import { Text, TextField, Button, ConfirmationDialog } from '../../styleguide'
import { CommentDTO } from '../../types/api'
import { useDeleteComment, useNewComment } from '../../hooks/comments'
import { NewCommentPayload } from '../../types/payloads'
import { useAuth } from '../../contexts/auth'
import { newCommentSchema } from '../../utils/validations'

type Props = {
  comments: CommentDTO[]
  questionId?: number
  projectId?: number
}

export const CommentList: React.FC<Props> = ({ questionId, projectId, comments }) => {
  const [comIdToDelete, setComIdToDelete] = useState<number | undefined>()
  const { user } = useAuth()

  const { mutateAsync: addComment, isLoading: isCreatingComment } = useNewComment()
  const { mutateAsync: deleteComment, isLoading: isDeletingComment } = useDeleteComment()

  const handleSubmit = (
    values: NewCommentPayload,
    { resetForm }: FormikHelpers<NewCommentPayload>
  ): void => {
    addComment({
      filters: { questionId, projectId },
      formData: values,
    }).finally(() => resetForm())
  }

  return (
    <>
      {comments.length > 0 ? (
        comments.map(comment => (
          <div key={comment.id} className="flex mb-6">
            <Avatar className="w-10 h-10">
              {comment.User.name[0].toUpperCase() + comment.User.surname[0].toUpperCase()}
            </Avatar>
            <div className="ml-4 flex-1">
              <div className="flex justify-between items-center">
                <Text className="font-semibold">
                  {comment.User.name + ' ' + comment.User.surname}
                </Text>
                <div className="flex items-center space-x-2">
                  {user?.id === comment.userId && (
                    <Tooltip title="Delete this comment">
                      <IconButton
                        className="p-0"
                        onClick={() => setComIdToDelete(comment.id)}
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  )}
                  <Text variant="body2">
                    {formatDistanceToNow(new Date(comment.createdAt)) + ' ago'}
                  </Text>
                </div>
              </div>
              <Text>{comment.text}</Text>
            </div>
          </div>
        ))
      ) : (
        <Text className="mb-4">(There are no comments)</Text>
      )}

      <Formik
        initialValues={{ text: '' }}
        validationSchema={newCommentSchema}
        onSubmit={handleSubmit}
      >
        <Form>
          <TextField name="text" label="Text" multiline rowsMax={4} />
          <div className="mt-2 flex justify-end">
            <Button type="submit" loading={isCreatingComment} color="secondary">
              Add comment
            </Button>
          </div>
        </Form>
      </Formik>

      <ConfirmationDialog
        open={!!comIdToDelete}
        onClose={() => setComIdToDelete(undefined)}
        onConfirm={() =>
          deleteComment(comIdToDelete!).finally(() => setComIdToDelete(undefined))
        }
        loading={isDeletingComment}
        description="Are you sure you want to delete this comment?"
        confirmText="Delete"
      />
    </>
  )
}
