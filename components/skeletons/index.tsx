import clsx from 'clsx'
import { Paper } from '@material-ui/core'
import { Skeleton } from '@material-ui/lab'

const QuestionRowSkeleton: React.FC = () => (
  <Paper className="px-2 py-4 grid grid-cols-12">
    <div className="col-span-6 px-2 flex items-center">
      <Skeleton variant="text" width={'70%'} height={24} />
    </div>
    <div className="col-span-3 px-2 flex">
      <Skeleton variant="circle" width={32} height={32} />
      <Skeleton variant="text" className="ml-2 w-20" />
    </div>
    <div className="col-span-2 px-2">
      <Skeleton variant="text" className="w-24 h-8" />
    </div>
    <div className="col-span-1 px-2 flex justify-end items-center">
      <Skeleton variant="circle" width={24} height={24} />
    </div>
  </Paper>
)

const ProjectCardSkeleton: React.FC = () => (
  <Paper className="px-2 pt-4 pb-2">
    <Skeleton variant="text" height={32} />
    <Skeleton variant="text" height={24} />
    <div className="flex justify-between items-center mt-8">
      <div className="flex items-center">
        <Skeleton variant="circle" width={32} height={32} />
        <Skeleton variant="text" className="w-24 h-8 ml-2" />
      </div>
      <Skeleton variant="circle" width={24} height={24} />
    </div>
  </Paper>
)

const UserCardSkeleton: React.FC = () => (
  <Paper className="p-6 flex flex-col items-center">
    <Skeleton variant="circle" width={96} height={96} />
    <Skeleton variant="text" width={'100%'} height={32} className="mt-4" />
  </Paper>
)

export const questionSkeletons = (count = 8, tight?: boolean): JSX.Element => (
  <div
    className={clsx({
      'space-y-6': !tight,
      'space-y-2': tight,
    })}
  >
    {[...new Array(count).keys()].map(key => (
      <QuestionRowSkeleton key={key} />
    ))}
  </div>
)

export const projectSkeletons = (count = 8, itemsPerRow = 4): JSX.Element => (
  <div className="grid grid-cols-12 gap-6">
    {[...new Array(count).keys()].map(key => (
      <div
        key={key}
        className={clsx({
          'col-span-3': itemsPerRow === 4,
          'col-span-4': itemsPerRow === 3,
          'col-span-6': itemsPerRow === 2,
        })}
      >
        <ProjectCardSkeleton />
      </div>
    ))}
  </div>
)

export const userSkeletons = (count = 8): JSX.Element => (
  <div className="grid grid-cols-12 gap-6">
    {[...new Array(count).keys()].map(key => (
      <div key={key} className="col-span-3">
        <UserCardSkeleton />
      </div>
    ))}
  </div>
)
