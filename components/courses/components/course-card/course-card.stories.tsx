import { ComponentMeta } from '@storybook/react'
import { MockAuthProvider } from '../../../../lib/contexts'

import CourseCard from '.'

export default {
  title: 'pages/Courses/CourseCard',
  component: CourseCard,
} as ComponentMeta<typeof CourseCard>

export const AsDraft = () => (
  <MockAuthProvider>
    <CourseCard
      course={{
        id: 'crs-123',
        lengthMin: 60,
        level: 'Intermediate',
        title: 'Basic Electronics',
        description: 'The most interesting course ever.',
        categoryId: 'crs-cat-1',
        category: {
          id: 'crs-cat-1',
          label: 'Electronics',
        },
        thumbnailId: 'ast-1',
        thumbnail: {
          url: 'https: //cdn.tap3d.com/thumbnail',
        },
        instructors: [],
        objectives: [],
        previewImages: [],
        published: false,
      }}
    />
  </MockAuthProvider>
)

export const AsPublished = () => (
  <MockAuthProvider>
    <CourseCard
      course={{
        id: 'crs-123',
        lengthMin: 60,
        level: 'Intermediate',
        title: 'Basic Electronics',
        description: 'The most interesting course ever.',
        categoryId: 'crs-cat-1',
        category: {
          id: 'crs-cat-1',
          label: 'Electronics',
        },
        thumbnailId: 'ast-1',
        thumbnail: {
          url: 'https: //cdn.tap3d.com/thumbnail',
        },
        instructors: [],
        objectives: [],
        previewImages: [],
        published: true,
      }}
    />
  </MockAuthProvider>
)

export const Started = () => (
  <MockAuthProvider>
    <CourseCard
      course={{
        id: 'crs-123',
        lengthMin: 60,
        level: 'Intermediate',
        title: 'Basic Electronics',
        description: 'The most interesting course ever.',
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
        instructors: [],
        objectives: [],
        previewImages: [],
        published: true,
      }}
      courseRecord={{
        id: '123',
        userId: 'user-1',
        courseId: 'crs-123',
      }}
      progress={{
        completed: 4,
        total: 9,
      }}
    />
  </MockAuthProvider>
)
