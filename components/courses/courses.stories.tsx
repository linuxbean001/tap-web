import { ComponentMeta, ComponentStory } from '@storybook/react'

import Courses from '.'
import { courses } from '../../backend/data/mocks/course.mock'
import { Tap } from '../../lib'
import { DataFetchProvider, MockAuthProvider } from '../../lib/contexts/'
import { NextRouterProvider } from '../../lib/contexts/next-router'

export default {
  title: 'pages/Courses',
  component: Courses,
  parameters: {
    nextRouter: {
      path: '/courses',
      asPath: '/courses',
    },
  },
} as ComponentMeta<typeof Courses>

const courseRecords = courses.map(
  (course, i) =>
    ({
      id: `record-${course.id}`,
      courseId: course.id,
      course,
      createdAt: new Date().toISOString(),
      userId: 'user-1',
      user: null,
      courseTopicRecords: [
        ...(i === 1
          ? course.topics?.map(
              (courseTopic) =>
                ({
                  id: 'course-topic-record-1',
                  createdAt: new Date().toISOString(),
                  courseTopicId: courseTopic.id,
                  courseTopic,
                  activityRecords: courseTopic.activities?.map(
                    (activity, $a) => ({
                      id: 'course-topic-activity-record-1',
                      auId: 'https://tap3d.com/courses/123',
                      courseTopicRecordId: 'course-topic-record-1',
                      createdAt: new Date().toISOString(),
                      courseTopicActivityId: activity.id,
                      courseTopicActivity: activity,
                      completedAt: $a === 0 ? '2023-01-16T02:55:42.822Z' : null,
                      launchUrl: 'https://...',
                    })
                  ),
                  courseRecordId: `record-${course.id}`,
                } as Tap.Course.TopicRecord)
            )
          : []),
      ],
    } as Tap.Course.Record)
)
const getUserCourseRecords = async () => courseRecords
const getCourses = async () => courses

export const Index = () => {
  return (
    <NextRouterProvider path="/courses">
      <DataFetchProvider>
        <MockAuthProvider>
          <Courses
            getUserCourseRecords={getUserCourseRecords}
            getCourses={getCourses}
          />
        </MockAuthProvider>
      </DataFetchProvider>
    </NextRouterProvider>
  )
}

export const WithElectronicsCategoryFilter: ComponentStory<
  typeof Courses
> = () => {
  return (
    <NextRouterProvider path="/courses" query={{ category: 'Electronics' }}>
      <DataFetchProvider>
        <MockAuthProvider>
          <Courses
            getUserCourseRecords={getUserCourseRecords}
            getCourses={getCourses}
          />
        </MockAuthProvider>
      </DataFetchProvider>
    </NextRouterProvider>
  )
}

export const WithMechatronicsCategoryFilter: ComponentStory<
  typeof Courses
> = () => {
  return (
    <NextRouterProvider path="/courses" query={{ category: 'Mechatronics' }}>
      <DataFetchProvider>
        <MockAuthProvider>
          <Courses
            getUserCourseRecords={getUserCourseRecords}
            getCourses={getCourses}
          />
        </MockAuthProvider>
      </DataFetchProvider>
    </NextRouterProvider>
  )
}

export const WithEmpty = () => {
  return (
    <NextRouterProvider path="/courses">
      <DataFetchProvider>
        <MockAuthProvider>
          <Courses
            getUserCourseRecords={async () => []}
            getCourses={async () => []}
          />
        </MockAuthProvider>
      </DataFetchProvider>
    </NextRouterProvider>
  )
}

export const WithError = () => {
  return (
    <NextRouterProvider path="/courses">
      <DataFetchProvider>
        <MockAuthProvider>
          <Courses
            getUserCourseRecords={async () =>
              Promise.reject(
                new Error('Sample error when fetching course records')
              )
            }
            getCourses={getCourses}
          />
        </MockAuthProvider>
      </DataFetchProvider>
    </NextRouterProvider>
  )
}

WithError.parameters = {
  storyshots: { disable: true },
}

export const AsAdmin = () => {
  return (
    <NextRouterProvider path="/courses">
      <DataFetchProvider>
        <MockAuthProvider
          user={
            {
              role: Tap.User.Role.Admin,
            } as any
          }
        >
          <Courses
            getUserCourseRecords={getUserCourseRecords}
            getCourses={getCourses}
          />
        </MockAuthProvider>
      </DataFetchProvider>
    </NextRouterProvider>
  )
}
