import Image from 'next/image'
import { forwardRef, HTMLAttributes } from 'react'
import { setDefaultProps } from '../../../../lib'
import { useCurrentUser, useDataFetch, useRole } from '../../../../lib/contexts'
import Tooltip from '../../../tooltip'
import {
  getProgressSummary,
  getUserProgressSummary,
} from '../../dashboard.service'
import { useSelectedTimeState, useSelectedUserState } from '../../state'
import ProgressInfoBlock from '../progress-info-block'

type Props = {
  getProgressSummary?: typeof getProgressSummary
  getUserProgressSummary?: typeof getUserProgressSummary
} & HTMLAttributes<HTMLDivElement>

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)

function getHoursFromSeconds(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const hoursString = hours < 1 ? 0 : Math.round(hours).toLocaleString('en-US')
  const timeSpent = `${hoursString} hrs, ${
    minutes < 1 ? 0 : Math.round(minutes)
  } mins`
  return timeSpent
}

const dataMapper = (data: { [key: string]: number }) => {
  return Object.entries(data ?? {})?.map(([key, val]) => {
    const res = key.replace(/([a-z])([A-Z])/g, '$1 $2')
    let title = capitalize(res)
    let value: string | number = val
    if (title.startsWith('Average')) {
      title = title.replace('Average', 'Avg')
      value = `${Math.round(value)}%`
    }
    if (title.startsWith('Topics')) {
      title = title.replace('Topics', 'Activities')
    }
    if (title.startsWith('Points')) {
      value = value.toLocaleString('en-US')
    }
    if (title.startsWith('Learning')) {
      value = getHoursFromSeconds(Number(value))
    }
    return {
      title,
      value,
    }
  })
}

const Skeleton = () => (
  <div className="px-6 max-w-sm w-full mx-auto">
    <div className="animate-pulse flex">
      <div className="flex-1">
        <div className="bg-gray-3  w-3/4 mb-4">
          <span className="text-dark-secondary text-h-xs font-medium invisible">
            noop
          </span>
        </div>
        <div className="bg-gray-3  w-2/4">
          <p className="text-dark-primary text-h-lg font-medium invisible">
            noop
          </p>
        </div>
      </div>
    </div>
  </div>
)

const ProgressPanelSkeleton = () => {
  return (
    <>
      <Skeleton />
      <Skeleton />
      <Skeleton />
      <Skeleton />
    </>
  )
}

const ProgressPanel = (
  { getProgressSummary, getUserProgressSummary }: Props,
  ref: React.ForwardedRef<HTMLDivElement>
) => {
  const [selectedUser] = useSelectedUserState()
  const [selectedTime] = useSelectedTimeState()
  const { user } = useCurrentUser()
  const { isAdmin, isOwner } = useRole()
  const userId = !isAdmin() || !isOwner() ? user?.id : selectedUser?.id
  const organizationId = user?.organization?.id

  const { data, error } = useDataFetch(
    isAdmin() || (isOwner() && selectedUser?.id === null)
      ? `/reports/admin-progress-summary/${organizationId}?daterange=${JSON.stringify(
          selectedTime
        )}`
      : `/reports/user-progress-summary/${userId}?daterange=${JSON.stringify(
          selectedTime
        )}`,
    {
      fetcher: async () =>
        (isAdmin() || isOwner()) && selectedUser?.id === null
          ? getProgressSummary(organizationId, selectedTime)
          : getUserProgressSummary(userId, selectedTime),
    }
  )
  const isLoading = !data && !error
  const mappedData = dataMapper(data)

  return (
    <div
      className="grid grid-cols md:grid-cols-4 divide-y-2 md:divide-y-0 divide-x-0 md:divide-x divide-gray-4 bg-gray-0 py-6 mt-0 md:mt-12 rounded shadow-md md:shadow-sm"
      ref={ref}
    >
      {isLoading ? (
        <ProgressPanelSkeleton />
      ) : (
        mappedData.map((item, index) => (
          <ProgressInfoBlock
            title={item.title}
            value={item.value}
            key={item.value + item.title}
            icon={
              index === mappedData.length - 1 && (
                <Tooltip
                  content="Measures the average percentage difference 
                between users’ pre and post assessments"
                  className="ml-1.5"
                >
                  <Image
                    src="/images/question-circle.svg"
                    width="18"
                    height="18"
                    alt="question icon"
                  />
                </Tooltip>
              )
            }
          />
        ))
      )}
    </div>
  )
}

const ForwardedRefProgressPanel = forwardRef(ProgressPanel)

setDefaultProps(ForwardedRefProgressPanel, {
  getProgressSummary,
  getUserProgressSummary,
})

export default ForwardedRefProgressPanel

export { ForwardedRefProgressPanel as ProgressPanel }
