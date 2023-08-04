import type Course from '../../../lib/domain/course'
import { WithTimestamps } from '../../services/db'

export const courseTopicActivity: Course.TopicActivity = {
  id: 'crs-top-act-10',
  auId: 'https://tap3d.com/au/9',
  title: 'Introduction to Mechatronics',
  description: `Mechatronics is the integration of mechanical engineering, electrical engineering, and computer science to design and manufacture intelligent systems. It is a multidisciplinary field that combines principles from various engineering disciplines to create complex, integrated systems that are capable of intelligent decision-making and control.`,
  path: '/curriculum/index.html',
  order: 0,
  courseTopicId: 'crs-top-9',
  type: 'Activity_Check',
}

export const courseTopicActivityWithTimestamps: WithTimestamps<Course.TopicActivity> =
  {
    ...courseTopicActivity,
    createdAt: 'now',
    updatedAt: 'now',
  }

export const courseTopicActivities: Course.TopicActivity[] = [
  {
    id: 'crs-top-act-11',
    auId: 'https://tap3d.com/au/10',
    title: 'Types of Mechanical Systems',
    description: `Mechanical systems can be broadly classified into two main types: linear systems and rotary systems. Linear systems involve the movement of components in a straight line, such as in a conveyor belt or a robotic arm. Rotary systems involve the movement of components in a circular or rotational motion, such as in a car engine or a turbine.`,
    path: '',
    order: 0,
    courseTopicId: 'crs-top-10',
    type: 'Activity_Check',
  },
  {
    id: 'crs-top-act-12',
    auId: 'https://tap3d.com/au/12',
    title: 'Components of Mechanical Systems',
    description: `Mechanical systems are made up of various components, such as gears, pulleys, belts, shafts, and bearings. These components work together to convert energy into motion, and to transmit, control, and distribute power within the system.`,
    path: '',
    order: 1,
    courseTopicId: 'crs-top-10',
    type: 'Activity_Check',
  },
]
