import { ComponentMeta } from '@storybook/react'

import Jumbotron from '.'

export default {
  title: 'pages/Courses/Jumbotron',
  component: Jumbotron,
} as ComponentMeta<typeof Jumbotron>

export const Index = () => <Jumbotron />
