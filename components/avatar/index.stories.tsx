import { ComponentMeta } from '@storybook/react'
import Avatar from '.'

export default {
  title: 'shared/Avatar',
  component: Avatar,
} as ComponentMeta<typeof Avatar>

export const Index = () => <Avatar>IK</Avatar>

export const WithTheme = () => <Avatar theme="primary">IK</Avatar>

export const WithIntensity = () => (
  <Avatar intensity="dark" theme="gray">
    IK
  </Avatar>
)

export const WithSize = () => <Avatar size="lg">IK</Avatar>
