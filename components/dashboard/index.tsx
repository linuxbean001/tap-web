import Head from 'next/head'
import { useEffect } from 'react'
import Layout from '../../components/layout'
import { useAnalytics } from '../../lib/contexts/analytics/analytics.provider'
import DashboardFilters from './components/dashboard-filters'
import { LeaderBoard } from './components/leaderboard'
import { ProgressPanel } from './components/progress-panel'
import { SessionOverTime } from './components/sessions-over-time'
import { SkillDistribution } from './components/skill-distribution'
import { getOrganizationGroupsById } from './dashboard.service'
import { useSelectedTimeState, useSelectedUserState } from './state'

type DashboardProps = {
  children?: any
  className?: any
  getOrganizationGroupsById: typeof getOrganizationGroupsById
}

export function Dashboard({
  children,
  className,
  getOrganizationGroupsById,
  ...props
}: DashboardProps) {
  const { analytics } = useAnalytics()
  const [selectedUser, setSelectedUser] = useSelectedUserState()
  const [selectedTime, setSelectedTime] = useSelectedTimeState()

  useEffect(() => {
    analytics.page('Dashboard')
  }, [analytics])

  return (
    <>
      <Head>
        <title>TAP | Dashboard</title>
      </Head>
      <Layout>
        <header className="flex justify-between flex-col md:flex-row">
          <h3 className="font-Inter text-h-md md:text-h3-lg text-dark-primary font-medium mb-5 md:mb-0">
            Dashboard
          </h3>
          <DashboardFilters
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
            selectedTime={selectedTime}
            setSelectedTime={setSelectedTime}
          />
        </header>
        <section>
          <ProgressPanel />
          <div className="grid grid-cols md:grid-cols-3 gap-4 mt-6">
            <div className="col-span-2 rounded shadow-md md:shadow-sm">
              <SkillDistribution />
            </div>
            <LeaderBoard />
          </div>
          <div className="flex mt-6 rounded shadow-md md:shadow-sm">
            <SessionOverTime selectedUser={selectedUser} />
          </div>
        </section>
      </Layout>
    </>
  )
}

Dashboard.defaultProps = {
  getOrganizationGroupsById: getOrganizationGroupsById,
} as Partial<DashboardProps>

export default Dashboard
