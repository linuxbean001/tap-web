import { ComponentMeta } from '@storybook/react'
import { ProgressPanel } from '.'
import { DataFetchProvider, MockAuthProvider } from '../../../../lib/contexts'

export default {
  title: 'pages/Dashboard/ProgressPanel',
  component: ProgressPanel,
} as ComponentMeta<typeof ProgressPanel>

const adminData = {
  activeUsers: 100,
  learningHours: 5000,
  assessedUsers: 80,
  averageSkillGrowth: 15,
}

const memberData = {
  pointsEarned: 150,
  topicsCompleted: 2,
  averageScore: 20,
  averageSkillGrowth: 0,
}

export const Index = () => (
  <DataFetchProvider>
    <MockAuthProvider
      user={{
        role: 1,
        id: '',
        email: '',
        firstName: '',
        lastName: '',
        groups: [],
      }}
    >
      <div className="w-[1200px]">
        <ProgressPanel getProgressSummary={() => Promise.resolve(adminData)} />
      </div>
    </MockAuthProvider>
  </DataFetchProvider>
)

export const WithMemberView = () => (
  <DataFetchProvider>
    <MockAuthProvider>
      <div className="w-[1200px]">
        <ProgressPanel
          getUserProgressSummary={() => Promise.resolve(memberData)}
        />
      </div>
    </MockAuthProvider>
  </DataFetchProvider>
)
