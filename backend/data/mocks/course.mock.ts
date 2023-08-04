import type Course from '../../../lib/domain/course'
import { WithTimestamps } from '../../services/db'
import {
  courseTopicActivities,
  courseTopicActivity,
} from './course-topic-activity.mock'
import { courseTopics } from './course-topic.mock'

export const course: Course = {
  id: 'crs-1',
  lengthMin: 60,
  level: 'Intermediate',
  title: 'Basic Electronics',
  published: false,
  description:
    'The most interesting course ever. Some description about the course, and why you should take it',
  categoryId: 'crs-cat-1',
  category: {
    id: 'crs-cat-1',
    label: 'Electronics',
  },
  thumbnailId: 'ast-1',
  thumbnail: {
    type: 'image',
    url: 'https://images.unsplash.com/photo-1562408590-e32931084e23?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=640&q=80',
  },
  instructors: [
    {
      firstName: 'Sarah',
      lastName: 'Doe',
      title: 'Engineer',
      avatarId: 'ast-3',
      avatar: {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1573497161161-c3e73707e25c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80',
      },
      description: `Sarah has built a career as an electronics engineer, specializing in designing and building integrated circuits.
      Sarah has a bachelor's degree in electrical engineering from the University of Michigan. 
      She has worked as an engineer at companies like Motorola and Texas Instruments.`,
      id: 'instructor-1',
    },
    {
      firstName: 'John',
      lastName: 'Doe',
      title: 'Engineer',
      avatarId: 'ast-4',
      avatar: {},
      description: `John has built a career as an electronics engineer, specializing in designing and building integrated circuits.
      John has a bachelor's degree in electrical engineering from the University of Michigan. 
      He has worked as an engineer at companies like Motorola and Texas Instruments.`,
      id: 'instructor-2',
    },
  ],
  objectives: [
    'Learn the fundamentals of electronics',
    'Understand risks involved in electronics handling',
    'Learn to troubleshoot electronics',
  ],
  previewImages: [
    {
      id: 'ast-1',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1562408590-e32931084e23?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1280&q=80',
    },
    {
      id: 'ast-2',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1537151377170-9c19a791bbea?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1280&q=80',
    },
    {
      id: 'ast-3',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1280&q=80',
    },
  ],
  topics: courseTopics,
}
export const courseWithTimestamps: WithTimestamps<Course> = {
  ...course,
  createdAt: 'now',
  updatedAt: 'now',
}

export const courses: WithTimestamps<Course>[] = [
  courseWithTimestamps,
  {
    id: 'crs-2',
    lengthMin: 130,
    level: 'Intermediate',
    title: 'Intermediate Electronics',
    published: true,
    description:
      'The most interesting course ever. Some description about the course, and why you should take it',
    categoryId: 'crs-cat-1',
    category: {
      id: 'crs-cat-1',
      label: 'Electronics',
    },
    thumbnailId: 'ast-1',
    thumbnail: {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1537151377170-9c19a791bbea?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=640&q=80',
    },
    instructors: [],
    objectives: [
      'Learn the fundamentals of electronics',
      'Understand risks involved in electronics handling',
      'Learn to troubleshoot electronics',
    ],
    previewImages: [
      {
        id: 'ast-1',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1537151377170-9c19a791bbea?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1280&q=80',
      },
      {
        id: 'ast-2',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1280&q=80',
      },
      {
        id: 'ast-3',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1563770660941-20978e870e26?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1280&q=80',
      },
    ],
    topics: courseTopics,
    createdAt: 'now',
    updatedAt: 'now',
  },
  {
    id: 'crs-3',
    lengthMin: 210,
    level: 'Advanced',
    title: 'Advanced Mechatronics',
    published: true,
    description:
      'The most interesting course ever. Some description about the course, and why you should take it',
    categoryId: 'crs-cat-1',
    category: {
      id: 'crs-cat-1',
      label: 'Mechatronics',
    },
    thumbnailId: 'ast-1',
    thumbnail: {
      url: 'https://cdn.tap3d.com/thumbnail',
    },
    instructors: [],
    objectives: [
      'Learn the advanced concepts of mechatronics',
      'Understand risks involved in mechatronics handling',
      'Learn to troubleshoot mechatronics',
    ],
    previewImages: [],
    topics: [
      {
        id: 'crs-top-9',
        title: 'Pre-Assessment',
        description: 'Learn all the prequisites for working with Mechatronics',
        order: 0,
        courseId: 'crs-3',
        activities: [courseTopicActivity],
      },
      {
        id: 'crs-top-10',
        title: 'Mechanical Systems',
        description:
          'Learn about the basics of mechanical systems and their components',
        order: 1,
        courseId: 'crs-3',
        activities: courseTopicActivities,
      },
    ],
    createdAt: 'now',
    updatedAt: 'now',
  },
]
