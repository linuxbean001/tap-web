import { ComponentMeta, ComponentStory } from '@storybook/react'

import CourseOverview from '.'
import { courses } from '../../../backend/data/mocks'
import { Tap } from '../../../lib'
import { DataFetchProvider, MockAuthProvider } from '../../../lib/contexts'
import { NextRouterProvider } from '../../../lib/contexts/next-router'

export default {
  title: 'pages/CourseOverview',
  component: CourseOverview,
} as ComponentMeta<typeof CourseOverview>

const course = courses[0]
const courseRecords = {
  id: `crs-rec-${course.id}`,
  courseId: 'crs-1',
  course,
  created: new Date().toISOString(),
  userId: 'user-1',
  user: null,
  courseTopicRecords: course.topics?.map(
    (courseTopic, $t) =>
      ({
        id: `record:${courseTopic.id}`,
        created: new Date().toISOString(),
        courseRecordId: `record-${course.id}`,
        courseTopicId: courseTopic.id,
        courseTopic,
        activityRecords: courseTopic.activities?.map((activity, $a) => ({
          id: `record:${activity.id}`,
          created: new Date().toISOString(),
          courseTopicActivity: activity,
          completedAt:
            $t === 0
              ? '2023-01-16T02:55:42.822Z'
              : null && $a === 0
              ? '2023-01-16T02:55:42.822Z'
              : null,
          courseTopicActivityId: 'crs-top-act-1',
          courseTopicRecordId: 'crs-top-rec-1',
          launchUrl: 'https://...',
        })),
      } as Tap.Course.TopicRecord)
  ),
} as Tap.Course.Record

const getCourse = async (id: string) =>
  courses.find((course) => course.id === id)
const getCourseRecord = async () => courseRecords
const getUserCourseRecords = async (userId: string) => [courseRecords]

export const Index: ComponentStory<typeof CourseOverview> = () => {
  return (
    <NextRouterProvider
      path={`/courses/:id`}
      query={{ courseRecordId: 'crs-rec-123', id: 'crs-1' }}
    >
      <DataFetchProvider>
        <MockAuthProvider>
          <CourseOverview
            getUserCourseRecords={getUserCourseRecords}
            getCourseRecord={getCourseRecord}
            getCourse={getCourse}
          />
        </MockAuthProvider>
      </DataFetchProvider>
    </NextRouterProvider>
  )
}

export const AsMechatronics: ComponentStory<typeof CourseOverview> = () => {
  return (
    <NextRouterProvider
      path={`/courses/:id`}
      query={{ courseRecordId: 'crs-rec-123', id: 'crs-3' }}
    >
      <DataFetchProvider>
        <MockAuthProvider>
          <CourseOverview
            getUserCourseRecords={getUserCourseRecords}
            getCourseRecord={getCourseRecord}
            getCourse={getCourse}
          />
        </MockAuthProvider>
      </DataFetchProvider>
    </NextRouterProvider>
  )
}

export const AsNoRecord: ComponentStory<typeof CourseOverview> = () => {
  return (
    <NextRouterProvider
      path={`/courses/:id`}
      query={{ courseRecordId: null, id: 'crs-3' }}
    >
      <DataFetchProvider>
        <MockAuthProvider>
          <CourseOverview
            getUserCourseRecords={async () => []}
            getCourseRecord={async () => null}
            getCourse={getCourse}
          />
        </MockAuthProvider>
      </DataFetchProvider>
    </NextRouterProvider>
  )
}

export const AsAdmin: ComponentStory<typeof CourseOverview> = () => {
  return (
    <NextRouterProvider
      path={`/courses/:id`}
      query={{ courseRecordId: 'crs-rec-123', id: 'crs-1' }}
    >
      <DataFetchProvider>
        <MockAuthProvider
          user={
            {
              role: Tap.User.Role.Admin,
            } as any
          }
        >
          <CourseOverview
            getUserCourseRecords={async () => []}
            getCourseRecord={async () => null}
            getCourse={getCourse}
          />
        </MockAuthProvider>
      </DataFetchProvider>
    </NextRouterProvider>
  )
}
