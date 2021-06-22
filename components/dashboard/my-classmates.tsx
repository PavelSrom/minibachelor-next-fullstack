import { Avatar, Paper } from '@material-ui/core'
import { useRouter } from 'next/router'
import { userSkeletons } from '../../components/skeletons'
import { useAuth } from '../../contexts/auth'
import { useColleagues } from '../../hooks/colleagues'
import { Text } from '../../styleguide'

export const MyClassmates: React.FC = () => {
  const { user } = useAuth()
  const router = useRouter()

  const classmatesQuery = useColleagues(
    {
      role: 'student',
      school: user?.school,
      programme: user?.programme,
    },
    { enabled: !!user }
  )

  if (classmatesQuery.isLoading || !classmatesQuery.data) return userSkeletons()
  if (classmatesQuery.isError) return <p>Error :(</p>

  // filter out myself from the list
  const classmates = classmatesQuery.data?.filter(cm => cm.id !== user?.id)

  return (
    <>
      {classmates.length > 0 ? (
        <div className="grid grid-cols-12 gap-6">
          {classmates!.map(user => (
            <div key={user.id} className="col-span-3">
              <Paper
                className="p-6 flex flex-col items-center cursor-pointer"
                onClick={() => router.push(`/user/${user.id}`)}
              >
                <Avatar className="w-20 h-20 mb-4" />
                <Text variant="h2" className="truncate">
                  {user.name + ' ' + user.surname}
                </Text>
              </Paper>
            </div>
          ))}
        </div>
      ) : (
        <Text>(There are no classmates to show)</Text>
      )}
    </>
  )
}
