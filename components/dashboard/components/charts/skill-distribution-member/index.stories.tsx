import { ComponentMeta } from '@storybook/react'

import { SkillDistributionMemberChart } from '.'

export default {
  title: 'pages/Dashboard/SkiilDistributionMemberChart',
  component: SkillDistributionMemberChart,
} as ComponentMeta<typeof SkillDistributionMemberChart>

const skillByTopicData = [
  {
    topic: 'Topic 1',
    level: 'Novice',
  },
  {
    topic: 'Topic 2',
    level: 'Proficient',
  },
  {
    topic: 'Topic 3',
    level: 'Needs Practice',
  },
  {
    topic: 'Topic 4',
    level: 'Expert',
  },
  {
    topic: 'Topic 5',
    level: 'Proficient',
  },
  {
    topic: 'Topic 6',
    level: 'Needs Practice',
  },
]

export const Index = () => (
  <div className="w-4/12">
    <SkillDistributionMemberChart
      userId="12312-12"
      getUserSkillDistribution={async () => skillByTopicData}
    />
  </div>
)

export const WithNoData = () => (
  <div className="w-4/12">
    <SkillDistributionMemberChart
      userId="12312-12"
      getUserSkillDistribution={async () => []}
    />
  </div>
)

Index.parameters = {
  storyshots: { disable: true },
}

WithNoData.parameters = {
  storyshots: { disable: true },
}
