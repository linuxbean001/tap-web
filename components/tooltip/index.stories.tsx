import { ComponentMeta } from '@storybook/react'

import Tooltip from '.'

export default {
  title: 'shared/Tooltip',
  component: Tooltip,
} as ComponentMeta<typeof Tooltip>

export const Index = () => (
  <div style={{ display: 'flex', padding: '100px' }}>
    <Tooltip content="I'm a tooltip">Tooltip</Tooltip>
  </div>
)

export const WithRightDirection = () => (
  <div style={{ display: 'flex', padding: '100px' }}>
    <Tooltip content="I'm a tooltip" direction="right">
      Tooltip
    </Tooltip>
  </div>
)

export const WithLeftDirection = () => (
  <div style={{ display: 'flex', padding: '100px' }}>
    <Tooltip content="I'm a tooltip" direction="left">
      Tooltip
    </Tooltip>
  </div>
)

export const WithBottomDirection = () => (
  <div style={{ display: 'flex', padding: '100px' }}>
    <Tooltip content="I'm a tooltip" direction="bottom">
      Tooltip
    </Tooltip>
  </div>
)

export const WithCustomDelay = () => (
  <div style={{ display: 'flex', padding: '100px' }}>
    <Tooltip content="I'm a tooltip" direction="top" delay={1000}>
      Tooltip
    </Tooltip>
  </div>
)
