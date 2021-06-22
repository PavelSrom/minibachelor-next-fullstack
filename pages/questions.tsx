import { useEffect, useState } from 'react'
import clsx from 'clsx'
import {
  Container,
  Paper,
  IconButton,
  InputBase,
  TextField,
  Divider,
  MenuItem,
  Fab,
  Tooltip,
} from '@material-ui/core'
import Search from '@material-ui/icons/Search'
import ContactSupport from '@material-ui/icons/ContactSupport'
import { useQuestions } from '../hooks/questions'
import { QuestionList } from '../components/question-list'
import { QuestionDTO } from '../types/api'
import { QuestionDetail } from '../components/question-detail'
import { Text } from '../styleguide'
import { NewQuestionModal } from '../components/new-question-modal'
import { questionSkeletons } from '../components/skeletons'
import { useAuth } from '../contexts/auth'
import { schools } from '../utils/schools'
import { CustomNextPage } from '../types/next'
import { withAuth } from '../hoc/with-auth'

export const getServerSideProps = withAuth(async ({ session }) => {
  return {
    props: { session },
  }
})

const QuestionsPage: CustomNextPage = () => {
  const { user } = useAuth()

  const [questionsToRender, setQuestionsToRender] = useState<QuestionDTO[]>([])
  const [detailOpen, setDetailOpen] = useState<QuestionDTO | undefined>()
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const [school, setSchool] = useState<string>(user?.school ?? '')
  const [search, setSearch] = useState<string>('')

  const questionsQuery = useQuestions({ school }, { enabled: !!true })

  // filter questions by what is in search - title or description
  useEffect(() => {
    if (questionsQuery.data) {
      if (!!search) {
        setQuestionsToRender(
          questionsQuery.data.filter(q => {
            return (
              q.title.toLowerCase().includes(search.toLowerCase()) ||
              q.description.toLowerCase().includes(search.toLowerCase())
            )
          })
        )
      } else {
        setQuestionsToRender(questionsQuery.data)
      }
    }
  }, [questionsQuery.data, search])

  // correctly set 'school' text field value on first load
  useEffect(() => {
    if (user) setSchool(user?.school)
  }, [user])

  return (
    <Container maxWidth="lg" className="py-8">
      <Text variant="h1">People's questions</Text>
      <div className="mt-2 mb-16">
        <Text>
          Hi{user?.name ? ` ${user.name}` : ''}, this is your questions overview page
        </Text>
      </div>
      <div className="flex justify-between items-end">
        <Paper component="form" className="w-full max-w-md flex items-center p-1">
          <IconButton disableRipple>
            <Search />
          </IconButton>
          <InputBase
            className="ml-2 flex-1"
            placeholder="Search questions..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </Paper>

        <div className="flex items-end space-x-4">
          <TextField
            size="small"
            variant="outlined"
            label="School"
            value={school}
            onChange={e => {
              setSchool(e.target.value)
              setDetailOpen(undefined) // close quickview on school change
            }}
            select={!!schools[school]}
            InputLabelProps={{ shrink: true }}
          >
            {/* list only schools that offer the user's programme */}
            {Object.entries(schools)
              .filter(([_school, programmes]) => {
                // prevent app crash if user is still loading
                if (!user?.programme) return false

                return programmes.includes(user?.programme)
              })
              .map(([school]) => (
                <MenuItem key={school} value={school}>
                  {school}
                </MenuItem>
              ))}
          </TextField>
          <TextField
            size="small"
            variant="outlined"
            label="Programme"
            disabled
            value={user?.programme}
            InputLabelProps={{ shrink: true }}
          />
        </div>
      </div>
      <Divider className="mt-2 mb-6" />

      {questionsQuery.isLoading && questionSkeletons(8, true)}
      {questionsQuery.isError && <p>Error :(</p>}

      {questionsQuery.isSuccess && questionsQuery.data && (
        <div className="flex">
          <div
            className={clsx('transition-all duration-250', {
              'w-full': !detailOpen,
              'w-1/2': detailOpen,
            })}
          >
            <QuestionList
              questions={questionsToRender}
              onDetailClick={q => setDetailOpen(q)}
              detailOpen={!!detailOpen}
            />
          </div>

          <QuestionDetail
            question={detailOpen}
            onClose={() => setDetailOpen(undefined)}
          />
        </div>
      )}

      <NewQuestionModal open={modalOpen} onClose={() => setModalOpen(false)} />

      <Tooltip title="Ask question" placement="left">
        <Fab
          color="secondary"
          className="fixed bottom-4 right-4 text-white"
          onClick={() => setModalOpen(true)}
        >
          <ContactSupport />
        </Fab>
      </Tooltip>
    </Container>
  )
}

QuestionsPage.withLayout = true

export default QuestionsPage
