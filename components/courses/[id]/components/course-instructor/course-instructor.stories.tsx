import { ComponentMeta } from '@storybook/react'

import CourseInstructor from '.'

export default {
  title: 'pages/CourseOverview/CourseInstructor',
  component: CourseInstructor,
} as ComponentMeta<typeof CourseInstructor>

const headshot =
  'https://images.unsplash.com/photo-1573497161161-c3e73707e25c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80'

export const Index = () => (
  <CourseInstructor
    instructor={{
      firstName: 'Sarah',
      lastName: 'Doe',
      title: 'Engineer',
      avatarId: 'ast-1',
      avatar: {},
      description: `Sarah has built a career as an electronics engineer, specializing in designing and building integrated circuits.
      Sarah has a bachelor's degree in electrical engineering from the University of Michigan. 
      She has worked as an engineer at companies like Motorola and Texas Instruments.`,
      id: 'instructor-1',
    }}
  />
)

export const WithImageAvatar = () => (
  <CourseInstructor
    instructor={{
      firstName: 'Sarah',
      lastName: 'Doe',
      title: 'Engineer',
      avatarId: 'ast-1',
      avatar: {
        type: 'image',
        url: headshot,
      },
      description: `Sarah has built a career as an electronics engineer, specializing in designing and building integrated circuits.
      Sarah has a bachelor's degree in electrical engineering from the University of Michigan. 
      She has worked as an engineer at companies like Motorola and Texas Instruments.`,
      id: 'instructor-1',
    }}
  />
)
