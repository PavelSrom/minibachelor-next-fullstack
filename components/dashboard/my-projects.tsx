import clsx from 'clsx'
import { useState } from 'react'
import { ProjectCard } from '../../components/project-card'
import { ProjectDetail } from '../../components/project-detail'
import { projectSkeletons } from '../../components/skeletons'
import { useAuth } from '../../contexts/auth'
import { useProjects } from '../../hooks/projects'
import { Text } from '../../styleguide'
import { ProjectDTO } from '../../types/api'

export const MyProjects: React.FC = () => {
  const [detailOpen, setDetailOpen] = useState<ProjectDTO | undefined>()
  const { user } = useAuth()

  const projectsQuery = useProjects({ user: user!.id }, { enabled: !!user?.id })

  if (projectsQuery.isLoading) return projectSkeletons()
  if (projectsQuery.isError) return <p>Error :(</p>

  return (
    <div className="flex">
      <div
        className={clsx('transition-all duration-250', {
          'w-full': !detailOpen,
          'w-1/2': detailOpen,
        })}
      >
        {projectsQuery.data!.length > 0 ? (
          <div className="grid grid-cols-12 gap-6">
            {projectsQuery.data!.map(project => (
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
          <Text variant="body2">(There are no projects to show)</Text>
        )}
      </div>

      <ProjectDetail project={detailOpen} onClose={() => setDetailOpen(undefined)} />
    </div>
  )
}
