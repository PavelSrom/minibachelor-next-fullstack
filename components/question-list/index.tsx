import { useMemo } from 'react'
import startOfDay from 'date-fns/startOfDay'
import startOfWeek from 'date-fns/startOfWeek'
import startOfMonth from 'date-fns/startOfMonth'
import { QuestionDTO } from '../../types/api'
import { Text } from '../../styleguide'
import { QuestionRow } from '../question-row'

type Props = {
  questions: QuestionDTO[]
  onDetailClick: (q: QuestionDTO) => void
  detailOpen: boolean
}

export const QuestionList: React.FC<Props> = ({
  questions,
  onDetailClick,
  detailOpen,
}) => {
  const now = new Date()

  const startOfToday = startOfDay(now)
  const startOfThisWeek = startOfWeek(now, { weekStartsOn: 1 }) // week starts Monday
  const startOfThisMonth = startOfMonth(now)

  const renderQuestions = (questions: QuestionDTO[]): JSX.Element => {
    return (
      <div className="space-y-2">
        {questions.map(q => (
          <QuestionRow
            key={q.id}
            question={q}
            onDetailClick={() => onDetailClick(q)}
            detailOpen={detailOpen}
          />
        ))}
      </div>
    )
  }

  /**
   * today = question posted today, from 00:00
   * this week = questions posted from week beginning until yesterday 23:59:59
   * this month = questions posted from month beginning until start of this week
   * older = everything else
   */

  const questionsToday = useMemo(
    () => questions.filter(q => new Date(q.createdAt) >= startOfToday),
    // eslint-disable-next-line
    [questions]
  )
  const questionsThisWeek = useMemo(
    () =>
      questions.filter(
        q =>
          new Date(q.createdAt) >= startOfThisWeek && new Date(q.createdAt) < startOfToday
      ),
    // eslint-disable-next-line
    [questions]
  )
  const questionsThisMonth = useMemo(
    () =>
      questions.filter(
        q =>
          new Date(q.createdAt) >= startOfThisMonth &&
          new Date(q.createdAt) < startOfThisWeek
      ),
    // eslint-disable-next-line
    [questions]
  )
  const olderQuestions = useMemo(
    () => questions.filter(q => new Date(q.createdAt) < startOfThisMonth),
    // eslint-disable-next-line
    [questions]
  )

  return (
    <>
      <Text variant="h2" className="mb-2">
        Today ({questionsToday.length})
      </Text>
      {questionsToday.length > 0 ? (
        renderQuestions(questionsToday)
      ) : (
        <Text>(No questions have been posted today)</Text>
      )}

      <Text variant="h2" className="mt-12 mb-2">
        This week ({questionsThisWeek.length})
      </Text>
      {questionsThisWeek.length > 0 ? (
        renderQuestions(questionsThisWeek)
      ) : (
        <Text>(No questions have been posted this week)</Text>
      )}

      <Text variant="h2" className="mt-12 mb-2">
        This month ({questionsThisMonth.length})
      </Text>
      {questionsThisMonth.length > 0 ? (
        renderQuestions(questionsThisMonth)
      ) : (
        <Text>(No questions have been posted this month)</Text>
      )}

      <Text variant="h2" className="mt-12 mb-2">
        Older ({olderQuestions.length})
      </Text>
      {olderQuestions.length > 0 ? (
        renderQuestions(olderQuestions)
      ) : (
        <Text>(No questions have been posted earlier)</Text>
      )}
    </>
  )
}
