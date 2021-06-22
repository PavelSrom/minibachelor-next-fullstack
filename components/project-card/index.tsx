import { memo } from 'react'
import {
  Avatar,
  Card,
  CardActions,
  CardContent,
  IconButton,
  Tooltip,
} from '@material-ui/core'
import AddCircleOutline from '@material-ui/icons/AddCircleOutline'
import { Text } from '../../styleguide'
import { ProjectDTO } from '../../types/api'

type Props = {
  project: ProjectDTO
  onDetailClick: (project: ProjectDTO) => void
}

export const ProjectCard: React.FC<Props> = memo(({ project, onDetailClick }) => {
  const userInitials =
    project.User.name[0].toUpperCase() + project.User.surname[0].toUpperCase()

  return (
    <Card>
      <CardContent>
        <Text variant="h2" className="truncate">
          {project.title}
        </Text>
        <Text className="truncate">
          {project.description ? project.description : '(No description provided)'}
        </Text>
      </CardContent>
      <CardActions className="flex justify-between">
        <div className="flex items-center">
          <Avatar className="w-8 h-8 mr-2">{userInitials}</Avatar>
          <Text variant="body2">
            by{' '}
            <span className="font-semibold">{`${project.User.name} ${project.User.surname}`}</span>
          </Text>
        </div>
        <Tooltip title="View detail">
          <IconButton
            size="small"
            color="secondary"
            onClick={() => onDetailClick(project)}
          >
            <AddCircleOutline />
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
  )
})

ProjectCard.displayName = 'ProjectCard'
