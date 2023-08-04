import { ComponentMeta } from '@storybook/react'

import StatusLabel from '.'

export default {
  title: 'shared/Card/StatusLabel',
  component: StatusLabel,
} as ComponentMeta<typeof StatusLabel>

export const Started = () => <StatusLabel theme="green">Started</StatusLabel>

export const ComingSoon = () => (
  <StatusLabel theme="yellow">Coming Soon</StatusLabel>
)
