import _ from 'lodash'
import { DateTime } from 'luxon'
import {
  Dispatch,
  forwardRef,
  HTMLAttributes,
  SetStateAction,
  useCallback,
  useEffect,
} from 'react'
import { Tap } from '../../../../lib'
import { useDataFetch } from '../../../../lib/contexts'
import { useAnalytics } from '../../../../lib/contexts/analytics/analytics.provider'
import User from '../../../../lib/domain/user'
import { setDefaultProps } from '../../../../lib/utils/default-props.utils'
import AutocompleteInput from '../../../autocomplete-input'
import { Restricted } from '../../../restricted'
import {
  getOrganizationGroupsById,
  getUsersInOrganization,
} from '../../dashboard.service'

type Props = {
  getOrganizationGroupsById?: typeof getOrganizationGroupsById
  selectedUser: Tap.User | PartialSubset<Tap.User>
  setSelectedUser: Dispatch<SetStateAction<Tap.User> | PartialSubset<Tap.User>>
  selectedTime: Record<string, string>
  setSelectedTime: Dispatch<SetStateAction<Record<string, string>>>
} & HTMLAttributes<HTMLDivElement>

const CURRENT_TIME = DateTime.utc().toISO()
const TIMES = [
  {
    label: 'Last 7 days',
    value: DateTime.utc().minus({ days: 7 }).toISO(),
  },
  {
    label: 'Last 14 days',
    value: DateTime.utc().minus({ days: 14 }).toISO(),
  },
  {
    label: 'Last 30 days',
    value: DateTime.utc().minus({ days: 30 }).toISO(),
  },
  {
    label: 'Last 2 months',
    value: DateTime.utc().minus({ months: 2 }).toISO(),
  },
  {
    label: 'Last 3 months',
    value: DateTime.utc().minus({ months: 3 }).toISO(),
  },
]

const DashboardFilters = (
  {
    getOrganizationGroupsById, // TODO: add filter by org group
    selectedUser,
    setSelectedUser,
    selectedTime,
    setSelectedTime,
  }: Props,
  ref: React.ForwardedRef<HTMLDivElement>
) => {
  const { analytics } = useAnalytics()
  const { data } = useDataFetch(`/user/usersInOrg`, {
    fetcher: async () => getUsersInOrganization(),
  })

  const unsortedUsers: PartialSubset<Tap.User[]> = [
    { label: 'All users', value: null },
    ...(data
      .filter((user) => user.role === 0)
      .map((user) => ({
        label: `${user?.firstName} ${user?.lastName}`,
        value: user.id,
        id: user.id,
        firstName: user?.firstName,
        lastName: user?.firstName,
      })) ?? []),
  ]

  const users = _.orderBy(unsortedUsers, ['label'])

  useEffect(() => {
    setSelectedTime({ start: TIMES[2].value, end: CURRENT_TIME })
    return () => {
      setSelectedUser({ id: null })
      setSelectedTime({ start: TIMES[2].value, end: CURRENT_TIME })
    }
  }, [])

  const onChangeSelectedUser = useCallback(
    (value) => {
      const userData: PartialSubset<User> = users?.find(
        (user) => user.id === value
      ) ?? { id: null }
      analytics.track('Dashboard Filter: Select User', userData)
      setSelectedUser(userData)
    },
    [users, analytics, setSelectedUser]
  )

  const onChangeSelectedTime = useCallback(
    (value) => {
      const timeRange = {
        ...selectedTime,
        start: value,
      }
      analytics.track('Dashboard Filter: Select Date Range', timeRange)
      setSelectedTime(timeRange)
    },
    [analytics, setSelectedTime, selectedTime]
  )

  return (
    <div ref={ref} className={`flex divide-x divide-gray-4`}>
      <Restricted to="Admin">
        <AutocompleteInput
          onChange={onChangeSelectedUser}
          options={users}
          value={selectedUser?.id}
          className="mr-3.5"
        />
      </Restricted>
      <AutocompleteInput
        onChange={onChangeSelectedTime}
        options={TIMES}
        value={selectedTime.start ?? TIMES[2].value}
        className="pl-3.5"
      />
    </div>
  )
}

const ForwardedRefDashboardFilters = forwardRef(DashboardFilters)

setDefaultProps(ForwardedRefDashboardFilters, {
  getOrganizationGroupsById: getOrganizationGroupsById,
} as Partial<Props>)

export default ForwardedRefDashboardFilters

export { ForwardedRefDashboardFilters as DashboardFilters }
