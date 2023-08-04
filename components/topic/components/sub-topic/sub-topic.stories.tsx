import { ComponentMeta } from '@storybook/react'

import SubTopic from '.'
import { useDataMutation } from '../../../../lib/contexts'

export default {
  title: 'shared/Topic/SubTopic',
  component: SubTopic,
} as ComponentMeta<typeof SubTopic>

export const Pending = () => {
  const { loading, mutate } = useDataMutation(
    () => new Promise((resolve) => setTimeout(resolve, 750))
  )
  return (
    <SubTopic
      title="Subtopic"
      description="Description about this subtopic"
      status="pending"
      isLoading={loading}
      style={{ maxWidth: '540px' }}
      onViewAction={mutate}
    />
  )
}

export const InProgress = () => {
  const { loading, mutate } = useDataMutation(
    () => new Promise((resolve) => setTimeout(resolve, 750))
  )
  return (
    <SubTopic
      title="Subtopic"
      description="Description about this subtopic"
      status="in-progress"
      style={{ maxWidth: '540px' }}
      isLoading={loading}
      onViewAction={mutate}
    />
  )
}

export const Completed = () => {
  const { loading, mutate } = useDataMutation(
    () => new Promise((resolve) => setTimeout(resolve, 750))
  )
  return (
    <SubTopic
      title="Subtopic"
      description="Description about this subtopic"
      status="completed"
      isLoading={loading}
      onViewAction={mutate}
      style={{ maxWidth: '540px' }}
    />
  )
}

export const Locked = () => {
  const { loading, mutate } = useDataMutation(
    () => new Promise((resolve) => setTimeout(resolve, 750))
  )
  return (
    <SubTopic
      title="Subtopic"
      description="Description about this subtopic"
      status="locked"
      isLoading={loading}
      onViewAction={mutate}
      style={{ maxWidth: '540px' }}
    />
  )
}
