import Image from 'next/image'
import { forwardRef, HTMLAttributes } from 'react'
import { useCurrentUser, useDataFetch } from '../../../../lib/contexts'
import { Tap } from '../../../../lib/domain'
import User, { Role } from '../../../../lib/domain/user'
import { setDefaultProps } from '../../../../lib/utils/default-props.utils'
import Tooltip from '../../../tooltip'
import { getLeaderBoard } from '../../dashboard.service'
import { useSelectedTimeState, useSelectedUserState } from '../../state'

type Props = {
  getLeaderBoard?: typeof getLeaderBoard
  className?: string | Record<string, boolean> | string[]
} & HTMLAttributes<HTMLDivElement>

const Skeleton = () => (
  <div className="max-w-sm w-full mx-auto">
    <div className="animate-pulse flex">
      <div className="flex-1">
        <div className="h-3 bg-gray-3 w-3/4 mb-4"></div>
        <div className="h-3 bg-gray-3 w-2/4 mb-4"></div>
        <div className="h-3 bg-gray-3 w-3/4 mb-4"></div>
        <div className="h-3 bg-gray-3 w-3/4 mb-4"></div>
        <div className="h-3 bg-gray-3 w-2/4 mb-4"></div>
        <div className="h-3 bg-gray-3 w-3/4 mb-4"></div>
        <div className="h-3 bg-gray-3 w-2/4"></div>
      </div>
    </div>
  </div>
)

function orderByArray<T, K extends keyof T>(values: T[], orderType: K) {
  return values.sort((a, b) => {
    if (typeof a[orderType] === 'number' && typeof b[orderType] === 'number') {
      const valA = a[orderType] as number
      const valB = b[orderType] as number
      return valB - valA
    }
  })
}

const LeaderBoard = (
  { getLeaderBoard }: Props,
  ref: React.ForwardedRef<HTMLDivElement>
) => {
  const [selectedTime] = useSelectedTimeState()
  const { data, error } = useDataFetch(
    `/reports/leaderboard?daterange=:${JSON.stringify(selectedTime)}`,
    {
      fetcher: async () => getLeaderBoard(selectedTime),
    }
  )
  const { user } = useCurrentUser()
  const [selectedUser] = useSelectedUserState()
  let updatedData = []
  let userScore: PartialSubset<User> & {
    points: number
    position: number | string
  } = null
  let displayUserScore = true
  if (user && data) {
    const currUser = selectedUser.id ? selectedUser : user
    updatedData = Array.isArray(data) ? (data as Tap.Report.Leaderboard) : []
    userScore = orderByArray(updatedData, 'points')
      .map((item, index) => ({ ...item, position: index + 1 }))
      .find((item) => item.id === currUser.id) ?? {
      ...currUser,
      points: data[0]?.points,
      position: '-',
    }
    displayUserScore = !(userScore.id === user.id && user.role > Role.Member)
  }

  const isLoading = !data && !error
  return (
    <div
      className="col-span-2 md:col-span-1 flex flex-col p-2 md:p-6 bg-gray-0 rounded shadow-md md:shadow-sm"
      ref={ref}
    >
      <h3 className="text-h-sm font-medium text-dark-primary mb-8 inline-flex items-center">
        Leaderboard
        <Tooltip
          content={`Points are earned by completing course 
          material and scoring high on assessments `}
          className="ml-1.5"
        >
          <Image
            src="/images/question-circle.svg"
            width="18"
            height="18"
            alt="question icon"
          />
        </Tooltip>
      </h3>
      {isLoading ? (
        <Skeleton />
      ) : (
        <ul>
          {orderByArray(updatedData, 'points')
            .slice(0, 12)
            .map((item, index) => (
              <li key={item.id} className="flex justify-between mb-4">
                <span className="flex text-dark-secondary text-sm mr-1">
                  {`${index + 1} ${item.firstName ?? 'Unknown User'} ${
                    item.lastName ?? ''
                  }`}
                </span>
                <span className="flex text-dark-secondary text-sm">
                  {item?.points?.toLocaleString('en-US')} pts
                </span>
              </li>
            ))}
          {userScore && displayUserScore && (
            <>
              <hr className="border-t border-gray-4 mt-6 mb-6" />
              <ol>
                <li className="flex justify-between">
                  <span className="flex text-dark-secondary text-sm">
                    {userScore.position} {userScore.firstName ?? 'Unknown User'}{' '}
                    {userScore.lastName ?? ''}
                  </span>

                  <span className="flex text-dark-secondary text-sm">
                    {userScore?.points?.toLocaleString('en-US')} pts
                  </span>
                </li>
              </ol>
            </>
          )}
        </ul>
      )}
    </div>
  )
}

const ForwardedRefLeaderBoard = forwardRef(LeaderBoard)

setDefaultProps(ForwardedRefLeaderBoard, {
  getLeaderBoard,
})

export default ForwardedRefLeaderBoard

export { ForwardedRefLeaderBoard as LeaderBoard }
