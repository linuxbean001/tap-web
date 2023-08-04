import { ComponentMeta } from '@storybook/react'

import TopicStatusIcon from '.'

export default {
  title: 'shared/Topic/TopicStatusIcon',
  component: TopicStatusIcon,
} as ComponentMeta<typeof TopicStatusIcon>

export const AsCompletedStatus = () => <TopicStatusIcon status="completed" />

export const AsLockedStatus = () => <TopicStatusIcon status="locked" />

export const AsIncompletedStatus = () => (
  <TopicStatusIcon status="incompleted" />
)
