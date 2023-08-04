import { ComponentMeta } from '@storybook/react'

import Tag from '.'

export default {
  title: 'shared/Tag',
  component: Tag,
} as ComponentMeta<typeof Tag>

export const Index = () => <Tag label="Simulation" />
