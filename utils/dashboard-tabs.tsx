import AccountCircle from '@material-ui/icons/AccountCircle'
import SentimentVerySatisfied from '@material-ui/icons/SentimentVerySatisfied'
import SupervisedUserCircle from '@material-ui/icons/SupervisedUserCircle'
import QuestionAnswer from '@material-ui/icons/QuestionAnswer'
import ListAlt from '@material-ui/icons/ListAlt'

export const tabs: { label: string; icon: JSX.Element }[] = [
  {
    label: 'My classmates',
    icon: <SentimentVerySatisfied />,
  },
  {
    label: 'My teachers',
    icon: <SupervisedUserCircle />,
  },
  {
    label: 'My questions',
    icon: <QuestionAnswer />,
  },
  {
    label: 'My projects',
    icon: <ListAlt />,
  },
  {
    label: 'Manage account',
    icon: <AccountCircle />,
  },
]
