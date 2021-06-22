import { useState } from 'react'
import clsx from 'clsx'
import { QuestionRow } from '../../components/question-row'
import { useAuth } from '../../contexts/auth'
import { useQuestions } from '../../hooks/questions'
import { Text } from '../../styleguide'
import { QuestionDTO } from '../../types/api'
import { QuestionDetail } from '../../components/question-detail'
import { questionSkeletons } from '../../components/skeletons'

export const MyQuestions: React.FC = () => {
  const [detailOpen, setDetailOpen] = useState<QuestionDTO | undefined>()
  const { user } = useAuth()

  const questionsQuery = useQuestions(
    { user: user?.id },
    {
      enabled: !!user?.id,
    }
  )

  if (questionsQuery.isLoading) return questionSkeletons()
  if (questionsQuery.isError) return <p>Error :(</p>

  return (
    <div className="flex">
      <div
        className={clsx('transition-all duration-250', {
          'w-full': !detailOpen,
          'w-1/2': detailOpen,
        })}
      >
        {' '}
        {questionsQuery.data!.length > 0 ? (
          <div className="space-y-6">
            {questionsQuery.data!.map(q => (
              <QuestionRow
                key={q.id}
                question={q}
                detailOpen={!!detailOpen}
                onDetailClick={() => setDetailOpen(q)}
              />
            ))}
          </div>
        ) : (
          <Text variant="body2">(There are no questions to show)</Text>
        )}
      </div>

      <QuestionDetail question={detailOpen} onClose={() => setDetailOpen(undefined)} />
    </div>
  )
}
