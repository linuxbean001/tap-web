import Image from 'next/image'
import { forwardRef, HTMLAttributes, useCallback } from 'react'
import { Tap } from '../../../../lib'
import { useCurrentUser, useDataFetch, useRole } from '../../../../lib/contexts'
import { setDefaultProps } from '../../../../lib/utils/default-props.utils'
import Tooltip from '../../../tooltip'
import {
  getAdminCompletedActivities,
  getCompletedActivities,
} from '../../dashboard.service'
import { useSelectedTimeState } from '../../state'
import { SessionsOverTimeChart } from '../charts/sessions-over-time'

type Props = {
  getCompletedActivities?: typeof getCompletedActivities
  selectedUser: Tap.User | PartialSubset<Tap.User>
} & HTMLAttributes<HTMLDivElement>

const SessionOverTime = (
  { getCompletedActivities, selectedUser }: Props,
  ref: React.ForwardedRef<HTMLDivElement>
) => {
  const [selectedTime, _] = useSelectedTimeState()
  const { user } = useCurrentUser()
  const { isAdmin } = useRole()
  const userId = !isAdmin() ? user?.id : selectedUser?.id
  const { data, error } = useDataFetch(
    isAdmin() && selectedUser?.id === null
      ? `/reports/admin-completed-activities?daterange=${JSON.stringify(
          selectedTime
        )}`
      : `/reports/completed-activities/${userId}?daterange=${JSON.stringify(
          selectedTime
        )}`,
    {
      fetcher: async () =>
        isAdmin() && selectedUser?.id === null
          ? await getAdminCompletedActivities(selectedTime)
          : await getCompletedActivities(userId, selectedTime),
    }
  )
  const isLoading = !data && !error

  const updatedData = useCallback(() => {
    return Array.isArray(data) ? (data as Tap.Report.CompletedActivities) : []
  }, [data])

  return (
    <div className="flex flex-col p-2 md:p-6 bg-gray-0 w-full" ref={ref}>
      <header className="flex justify-between mb-8">
        <h3 className="text-h-sm font-medium text-dark-primary inline-flex items-center">
          Sessions Over Time
          <Tooltip content="Sessions Over Time" className="ml-1.5">
            <Image
              src="/images/question-circle.svg"
              width="18"
              height="18"
              alt="question icon"
            />
          </Tooltip>
        </h3>
      </header>
      <section>
        <div className="">
          <h3 className="text-lg p-6">Trainings Completed</h3>
        </div>
        {isLoading ? (
          <SessionsOverTimeChart data={[]} />
        ) : (
          <SessionsOverTimeChart data={updatedData()} />
        )}
      </section>
    </div>
  )
}

const ForwardedRefSessionOverTime = forwardRef(SessionOverTime)

setDefaultProps(ForwardedRefSessionOverTime, {
  getCompletedActivities,
})

export default ForwardedRefSessionOverTime

export { ForwardedRefSessionOverTime as SessionOverTime }
