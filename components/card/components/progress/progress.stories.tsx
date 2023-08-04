import { ComponentMeta } from '@storybook/react'

import Progress from '.'

export default {
  title: 'shared/Card/Progress',
  component: Progress,
} as ComponentMeta<typeof Progress>

export const Half = () => <Progress value={50}>5/10</Progress>

export const Complete = () => <Progress value={100}>10/10</Progress>
