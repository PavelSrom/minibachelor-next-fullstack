import { useState } from 'react'
import { useRouter } from 'next/router'
import format from 'date-fns/format'
import clsx from 'clsx'
import { Grow, Paper, Avatar, IconButton, Tooltip, Divider } from '@material-ui/core'
import Link from '@material-ui/icons/Link'
import Delete from '@material-ui/icons/Delete'
import Close from '@material-ui/icons/Close'
import { useComments } from '../../hooks/comments'
import { ConfirmationDialog, Text } from '../../styleguide'
import { ProjectDTO } from '../../types/api'
import { CommentList } from '../comment-list'
import { useAuth } from '../../contexts/auth'
import { useDeleteProject } from '../../hooks/projects'

type Props = {
  project: ProjectDTO | undefined
  onClose: () => void
}

export const ProjectDetail: React.FC<Props> = ({ project, onClose }) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const router = useRouter()
  const { user } = useAuth()

  const { mutateAsync: deleteProject, isLoading: isDeletingProject } = useDeleteProject()
  const commentsQuery = useComments(
    { projectId: project?.id ?? 0 },
    { enabled: !!project?.id }
  )

  const notMyProject = user?.id !== project?.userId

  return (
    <Grow in={!!project}>
      <div
        className={clsx({
          // change classes here to fix quickview tooltip behavior
          'w-1/2 visible ml-6': !!project,
          'w-0 invisible': !project,
        })}
      >
        <Paper className="p-6 sticky" style={{ top: 88 }}>
          <div className="flex justify-between items-start mb-4">
            <div className="flex">
              <Avatar className="w-16 h-16 text-3xl">
                {project &&
                  project?.User.name[0].toUpperCase() +
                    project?.User.surname[0].toUpperCase()}
              </Avatar>
              <div className="ml-4">
                <Text variant="h2">{project?.title}</Text>
                <Text>
                  by{' '}
                  <span
                    className={clsx('font-semibold', {
                      'cursor-pointer underline': notMyProject,
                    })}
                    onClick={() =>
                      notMyProject ? router.push(`/user/${project?.userId}`) : null
                    }
                  >
                    {project?.User.name} {project?.User.surname}
                  </span>
                </Text>
                {project?.createdAt && (
                  <Text variant="body2">
                    {format(new Date(project!.createdAt), 'dd.MM.yyyy, HH:mm')}
                  </Text>
                )}
                <div>
                  {project?.otherUrl && (
                    <Tooltip title="View details in a new tab">
                      <IconButton size="small" color="primary">
                        <a
                          href={project?.otherUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-6 h-6 flex items-center"
                        >
                          <Link />
                        </a>
                      </IconButton>
                    </Tooltip>
                  )}
                  <Tooltip title="View demo in a new tab">
                    <IconButton size="small" color="secondary">
                      <a
                        href={project?.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-6 h-6 flex items-center"
                      >
                        <Link />
                      </a>
                    </IconButton>
                  </Tooltip>
                </div>
              </div>
            </div>
            <div className="space-x-2 flex">
              {project?.userId === user?.id && (
                <Tooltip title="Delete project">
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

          <Text>
            {project?.description ? project.description : '(No description provided)'}
          </Text>

          <Text variant="h2" className="mt-8">
            Comments {commentsQuery.data && `(${commentsQuery.data.length})`}
          </Text>
          <Divider className="mt-2 mb-4" />
          {commentsQuery.isLoading && <p>Loading...</p>}
          {commentsQuery.isError && <p>Error :(</p>}

          {commentsQuery.isSuccess && commentsQuery.data && (
            <CommentList projectId={project!.id} comments={commentsQuery.data} />
          )}
        </Paper>

        <ConfirmationDialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={() =>
            deleteProject(project!.id).then(() => {
              setDeleteDialogOpen(false)
              onClose()
            })
          }
          loading={isDeletingProject}
          description="Are you sure you want to delete this project? All its comments will also be deleted."
          confirmText="Delete"
        />
      </div>
    </Grow>
  )
}
