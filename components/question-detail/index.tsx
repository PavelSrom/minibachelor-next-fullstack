import { useState } from 'react'
import { useRouter } from 'next/router'
import format from 'date-fns/format'
import clsx from 'clsx'
import { Grow, Paper, Avatar, IconButton, Tooltip, Divider } from '@material-ui/core'
import Delete from '@material-ui/icons/Delete'
import Close from '@material-ui/icons/Close'
import { useComments } from '../../hooks/comments'
import { ConfirmationDialog, Text } from '../../styleguide'
import { QuestionDTO } from '../../types/api'
import { CommentList } from '../comment-list'
import { useAuth } from '../../contexts/auth'
import { useDeleteQuestion } from '../../hooks/questions'

type Props = {
  question: QuestionDTO | undefined
  onClose: () => void
}

export const QuestionDetail: React.FC<Props> = ({ question, onClose }) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const router = useRouter()
  const { user } = useAuth()

  const { mutateAsync: deleteQuestion, isLoading: isDeletingQuestion } =
    useDeleteQuestion()
  const commentsQuery = useComments(
    { questionId: question?.id ?? 0 },
    { enabled: !!question?.id }
  )

  const notMyQuestion = user?.id !== question?.userId

  return (
    <Grow in={!!question}>
      <div
        className={clsx({
          // change classes here to fix quickview tooltip behavior
          'w-1/2 visible ml-6': !!question,
          'w-0 invisible': !question,
        })}
      >
        <Paper className="p-6 sticky" style={{ top: 88 }}>
          <div className="flex justify-between items-start mb-4">
            <div className="flex">
              <Avatar className="w-16 h-16 text-3xl">
                {question &&
                  question?.User.name[0].toUpperCase() +
                    question?.User.surname[0].toUpperCase()}
              </Avatar>
              <div className="ml-4">
                <Text variant="h2">{question?.title}</Text>
                <Text>
                  by{' '}
                  <span
                    className={clsx('font-semibold', {
                      'cursor-pointer underline': notMyQuestion,
                    })}
                    onClick={() =>
                      notMyQuestion ? router.push(`/user/${question?.userId}`) : null
                    }
                  >
                    {question?.User.name} {question?.User.surname}
                  </span>
                </Text>
                {question?.createdAt && (
                  <Text variant="body2">
                    {format(new Date(question!.createdAt), 'dd.MM.yyyy, HH:mm')}
                  </Text>
                )}
              </div>
            </div>
            <div className="space-x-2 flex">
              {question?.userId === user?.id && (
                <Tooltip title="Delete question">
                  <IconButton size="small" onClick={() => setDeleteDialogOpen(true)}>
                    <Delete />
                  </IconButton>
                </Tooltip>
              )}
              <Tooltip title="Close detail">
                <IconButton size="small" edge="end" onClick={onClose}>
                  <Close />
                </IconButton>
              </Tooltip>
            </div>
          </div>

          <Text>{question?.description ?? '(No description)'}</Text>

          <Text variant="h2" className="mt-8">
            Comments {commentsQuery.data && `(${commentsQuery.data.length})`}
          </Text>
          <Divider className="mt-2 mb-4" />
          {commentsQuery.isLoading && <p>Loading...</p>}
          {commentsQuery.isError && <p>Error :(</p>}

          {commentsQuery.isSuccess && commentsQuery.data && (
            <CommentList questionId={question!.id} comments={commentsQuery.data} />
          )}
        </Paper>

        <ConfirmationDialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={() =>
            deleteQuestion(question!.id).finally(() => {
              setDeleteDialogOpen(false)
              onClose()
            })
          }
          loading={isDeletingQuestion}
          description="Are you sure you want to delete this question? All its comments will also be deleted."
          confirmText="Delete"
        />
      </div>
    </Grow>
  )
}
