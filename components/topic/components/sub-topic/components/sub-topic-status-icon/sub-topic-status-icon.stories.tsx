import { ComponentMeta } from '@storybook/react'

import SubTopicStatusIcon from '.'

export default {
  title: 'shared/Topic/SubTopic/SubTopicStatusIcon',
  component: SubTopicStatusIcon,
} as ComponentMeta<typeof SubTopicStatusIcon>

export const AsCompletedStatus = () => <SubTopicStatusIcon status="completed" />

export const AsInProgressStatus = () => (
  <SubTopicStatusIcon status="in-progress" />
)

export const AsPendingStatus = () => <SubTopicStatusIcon status="pending" />
