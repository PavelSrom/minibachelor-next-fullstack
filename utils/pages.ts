import Dashboard from '@material-ui/icons/Dashboard'
import QuestionAnswer from '@material-ui/icons/QuestionAnswer'
import ListAlt from '@material-ui/icons/ListAlt'

type Page = {
  url: string
  label: string
  icon: React.ComponentType
}

export const navbarPages: Page[] = [
  {
    url: '/dashboard',
    label: 'Dashboard',
    icon: Dashboard,
  },
  {
    url: '/questions',
    label: 'Questions',
    icon: QuestionAnswer,
  },
  {
    url: '/projects',
    label: 'Projects',
    icon: ListAlt,
  },
]
