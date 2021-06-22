import { memo } from 'react'
import clsx from 'clsx'
import format from 'date-fns/format'
import { Avatar, IconButton, Paper, Tooltip } from '@material-ui/core'
import AddCircleOutline from '@material-ui/icons/AddCircleOutline'
import { Text } from '../../styleguide'
import { QuestionDTO } from '../../types/api'

type Props = {
  question: QuestionDTO
  onDetailClick: () => void
  detailOpen: boolean
}

export const QuestionRow: React.FC<Props> = memo(
  ({ question, onDetailClick, detailOpen }) => {
    const userInitials =
      question.User.name[0].toUpperCase() + question.User.surname[0].toUpperCase()

    return (
      <Paper className="px-2 py-4 grid grid-cols-12">
        <div
          className={clsx('col-span-6 px-2 flex items-center', {
            'md:col-span-11': detailOpen,
          })}
        >
          <Text variant="body" className="font-semibold truncate">
            {question.title}
          </Text>
        </div>

        <div
          className={clsx('col-span-3 px-2 flex items-center', {
            hidden: detailOpen,
          })}
        >
          <Avatar className="w-8 h-8 mr-2">{userInitials}</Avatar>
          <Text variant="body2">
            by{' '}
            <span className="font-semibold">{`${question.User.name} ${question.User.surname}`}</span>
          </Text>
        </div>

        <div
          className={clsx('col-span-2 h-full flex items-center', {
            hidden: detailOpen,
          })}
        >
          <Text variant="body2">
            {format(new Date(question.createdAt), 'dd.MM.yyyy, HH:mm')}
          </Text>
        </div>

        <div className="col-span-1 flex justify-end">
          <Tooltip title="View detail">
            <IconButton size="small" color="secondary" onClick={onDetailClick}>
              <AddCircleOutline />
            </IconButton>
          </Tooltip>
        </div>
      </Paper>
    )
  }
)

QuestionRow.displayName = 'QuestionRow'
