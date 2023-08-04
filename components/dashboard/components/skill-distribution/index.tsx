import { forwardRef, HTMLAttributes, useCallback, useState } from 'react'
import { useCurrentUser, useDataFetch, useRole } from '../../../../lib/contexts'
import { getSkillDistribution } from '../../dashboard.service'
import { useSelectedTimeState, useSelectedUserState } from '../../state'
import { NoChartData } from '../charts/NoChartData'
import { SkillDistributionAdminChart } from '../charts/skill-distribution-admin'
import { SkillDistributionMemberChart } from '../charts/skill-distribution-member'

type Props = {} & HTMLAttributes<HTMLDivElement>

const SkillDistribution = (
  props: Props,
  ref: React.ForwardedRef<HTMLDivElement>
) => {
  const [selectedUser] = useSelectedUserState()
  const [selectedTime, _] = useSelectedTimeState()
  const [selectedTopicIds, setSelectedTopic] = useState<string[]>([])
  const { user } = useCurrentUser()
  const { isAdmin, isOwner } = useRole()
  const userId = isAdmin() || isOwner() ? selectedUser?.id : user?.id

  const courseIds = useCallback(
    () => selectedTopicIds.join(','),
    [selectedTopicIds]
  )()

  const { data, error } = useDataFetch(
    `/reports/admin-skill-distribution/courses/${courseIds}?daterange=${JSON.stringify(
      selectedTime
    )}`,
    {
      fetcher: async () =>
        selectedTopicIds.length > 0
          ? getSkillDistribution(courseIds, selectedTime)
          : [],
    }
  )

  return (
    <section className="flex flex-col p-6 bg-gray-0" ref={ref}>
      {userId ? (
        <SkillDistributionMemberChart userId={userId} />
      ) : isAdmin() || isOwner() ? (
        <SkillDistributionAdminChart
          data={data}
          error={error}
          setSelectedTopic={setSelectedTopic}
          selectedTopicIds={selectedTopicIds}
        />
      ) : (
        <NoChartData />
      )}
    </section>
  )
}

const ForwardedRefSkillDistribution = forwardRef(SkillDistribution)

export default ForwardedRefSkillDistribution

export { ForwardedRefSkillDistribution as SkillDistribution }
