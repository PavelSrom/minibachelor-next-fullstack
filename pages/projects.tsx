import { useEffect, useState } from 'react'
import clsx from 'clsx'
import {
  Container,
  Fab,
  Tooltip,
  IconButton,
  InputBase,
  Paper,
  MenuItem,
  Divider,
  TextField,
} from '@material-ui/core'
import Search from '@material-ui/icons/Search'
import PostAdd from '@material-ui/icons/PostAdd'
import { Text } from '../styleguide'
import { NewProjectModal } from '../components/new-project-modal'
import { useProjects } from '../hooks/projects'
import { ProjectCard } from '../components/project-card'
import { ProjectDTO } from '../types/api'
import { ProjectDetail } from '../components/project-detail'
import { useAuth } from '../contexts/auth'
import { projectSkeletons } from '../components/skeletons'
import { withAuth } from '../hoc/with-auth'
import { CustomNextPage } from '../types/next'

export const getServerSideProps = withAuth(async ({ session }) => {
  return {
    props: { session },
  }
})

const ProjectsPage: CustomNextPage = () => {
  const { user } = useAuth()

  const [projectsToRender, setProjectsToRender] = useState<ProjectDTO[]>([])
  const [detailOpen, setDetailOpen] = useState<ProjectDTO | undefined>()
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const [sortBy, setSortBy] = useState<string>('newest')
  const [search, setSearch] = useState<string>('')

  const projectsQuery = useProjects(
    {
      school: user?.school,
      programme: user?.programme,
    },
    {
      enabled: !!user,
    }
  )

  // filter projects by what is in search - title or description
  useEffect(() => {
    if (projectsQuery.data) {
      if (!!search) {
        setProjectsToRender(
          projectsQuery.data.filter(q => {
            return (
              q.title.toLowerCase().includes(search.toLowerCase()) ||
              q.description?.toLowerCase().includes(search.toLowerCase())
            )
          })
        )
      } else {
        setProjectsToRender(projectsQuery.data)
      }
    }
  }, [projectsQuery.data, search])

  return (
    <Container maxWidth="lg" className="py-8">
      <Text variant="h1">People's projects</Text>
      <div className="mt-2 mb-16">
        <Text>
          Hi{user?.name ? ` ${user.name}` : ''}, this is your projects overview page
        </Text>
      </div>
      <div className="flex justify-between items-end">
        <Paper component="form" className="w-full max-w-md flex items-center p-1">
          <IconButton disableRipple>
            <Search />
          </IconButton>
          <InputBase
            className="ml-2 flex-1"
            placeholder="Search projects..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </Paper>

        <div className="flex items-end space-x-4">
          <TextField
            size="small"
            variant="outlined"
            label="Sort by"
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            select
          >
            <MenuItem value="newest">Newest</MenuItem>
            <MenuItem value="oldest">Oldest</MenuItem>
          </TextField>
        </div>
      </div>
      <Divider className="mt-2 mb-6" />

      {projectsQuery.isLoading && projectSkeletons()}
      {projectsQuery.isError && <p>Error :(</p>}

      {projectsQuery.isSuccess && projectsQuery.data && (
        <div className="flex">
          <div
            className={clsx('transition-all duration-250', {
              'w-full': !detailOpen,
              'w-1/2': detailOpen,
            })}
          >
            {projectsToRender.length > 0 ? (
              <div className="grid grid-cols-12 gap-6">
                {projectsToRender.map(project => (
                  <div
                    key={project.id}
                    className={clsx({
                      'lg:col-span-6': !detailOpen,
                      'xl:col-span-3': !detailOpen,
                      'lg:col-span-12': detailOpen,
                      'xl:col-span-6': detailOpen,
                    })}
                  >
                    <ProjectCard
                      project={project}
                      onDetailClick={proj => setDetailOpen(proj)}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <Text>(There are no projects to show)</Text>
            )}
          </div>

          <ProjectDetail project={detailOpen} onClose={() => setDetailOpen(undefined)} />
        </div>
      )}

      <NewProjectModal open={modalOpen} onClose={() => setModalOpen(false)} />

      <Tooltip title="Upload project" placement="left">
        <Fab
          color="secondary"
          className="fixed bottom-4 right-4 text-white"
          onClick={() => setModalOpen(true)}
        >
          <PostAdd />
        </Fab>
      </Tooltip>
    </Container>
  )
}

ProjectsPage.withLayout = true

export default ProjectsPage
