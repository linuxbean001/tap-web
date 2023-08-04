import { ComponentMeta } from '@storybook/react'

import Skeleton from '.'

export default {
  title: 'shared/Skeleton',
  component: Skeleton,
} as ComponentMeta<typeof Skeleton>

export const Index = () => <Skeleton className="p-4" />
