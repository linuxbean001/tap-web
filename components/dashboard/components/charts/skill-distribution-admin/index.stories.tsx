import { ComponentMeta } from '@storybook/react'

import { SkillDistributionAdminChart } from '.'
import {
  adminSkillDistribution,
  courses,
} from '../../../../../backend/data/mocks/'
import { MockAuthProvider } from '../../../../../lib/contexts'

export default {
  title: 'pages/Dashboard/SkillDistributionAdminChart',
  component: SkillDistributionAdminChart,
} as ComponentMeta<typeof SkillDistributionAdminChart>

export const Index = () => (
  <MockAuthProvider>
    <div className="w-[700px] h-[350px]">
      <SkillDistributionAdminChart
        data={adminSkillDistribution}
        selectedTopicIds={adminSkillDistribution.map((item) => item.topicId)}
        setSelectedTopic={() => {}}
        getCourses={() => Promise.resolve(courses)}
      />
    </div>
  </MockAuthProvider>
)

Index.parameters = {
  storyshots: { disable: true },
}
