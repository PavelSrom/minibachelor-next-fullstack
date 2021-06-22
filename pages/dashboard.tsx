import { useState } from 'react'
import { useRouter } from 'next/router'
import { Container, Paper, Tab, Tabs } from '@material-ui/core'
import { SpeedDial, SpeedDialAction, SpeedDialIcon } from '@material-ui/lab'
import ContactSupport from '@material-ui/icons/ContactSupport'
import PostAdd from '@material-ui/icons/PostAdd'
import { NewQuestionModal } from '../components/new-question-modal'
import { NewProjectModal } from '../components/new-project-modal'
import { tabs } from '../utils/dashboard-tabs'
import { CustomNextPage } from '../types/next'
import { withAuth } from '../hoc/with-auth'
// tabs
import { MyClassmates } from '../components/dashboard/my-classmates'
import { MyTeachers } from '../components/dashboard/my-teachers'
import { MyQuestions } from '../components/dashboard/my-questions'
import { MyProjects } from '../components/dashboard/my-projects'
import { ManageAccount } from '../components/dashboard/manage-account'

const CLASSMATES = 0
const TEACHERS = 1
const QUESTIONS = 2
const PROJECTS = 3
const ACCOUNT = 4

export const getServerSideProps = withAuth(async ({ session }) => {
  return {
    props: { session },
  }
})

const DashboardPage: CustomNextPage = () => {
  const router = useRouter()
  const [speedDialOpen, setSpeedDialOpen] = useState<boolean>(false)
  const [projectModalOpen, setProjectModalOpen] = useState<boolean>(false)
  const [questionModalOpen, setQuestionModalOpen] = useState<boolean>(false)

  const [tabValue, setTabValue] = useState<number>(0)

  return (
    <Container maxWidth="lg" className="py-8">
      <Paper className="mb-6">
        <Tabs
          variant="fullWidth"
          value={tabValue}
          onChange={(_e, newValue) => setTabValue(newValue)}
          indicatorColor="secondary"
          textColor="secondary"
        >
          {tabs.map(({ label, icon }, index) => (
            <Tab key={label} label={label} value={index} icon={icon} />
          ))}
        </Tabs>
      </Paper>

      {tabValue === CLASSMATES && <MyClassmates />}
      {tabValue === TEACHERS && <MyTeachers />}
      {tabValue === QUESTIONS && <MyQuestions />}
      {tabValue === PROJECTS && <MyProjects />}
      {tabValue === ACCOUNT && <ManageAccount />}

      <SpeedDial
        ariaLabel="SpeedDial"
        className="fixed bottom-4 right-4"
        FabProps={{ color: 'secondary' }}
        icon={<SpeedDialIcon className="text-white" />}
        onClose={() => setSpeedDialOpen(false)}
        onOpen={() => setSpeedDialOpen(true)}
        open={speedDialOpen}
        direction="up"
      >
        <SpeedDialAction
          icon={<ContactSupport />}
          tooltipTitle="Ask question"
          onClick={() => {
            setSpeedDialOpen(false)
            setQuestionModalOpen(true)
          }}
        />
        <SpeedDialAction
          icon={<PostAdd />}
          tooltipTitle="Upload project"
          onClick={() => {
            setSpeedDialOpen(false)
            setProjectModalOpen(true)
          }}
        />
      </SpeedDial>

      <NewQuestionModal
        open={questionModalOpen}
        onClose={() => setQuestionModalOpen(false)}
        onCreated={() => router.push('/questions')}
      />
      <NewProjectModal
        open={projectModalOpen}
        onClose={() => setProjectModalOpen(false)}
        onCreated={() => router.push('/projects')}
      />
    </Container>
  )
}

DashboardPage.withLayout = true

export default DashboardPage
