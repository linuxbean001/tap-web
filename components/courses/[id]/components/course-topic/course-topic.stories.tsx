import { ComponentMeta } from '@storybook/react'

import CourseTopic from '.'
import { Tap } from '../../../../../lib'

export default {
  title: 'pages/CourseOverview/CourseTopic',
  component: CourseTopic,
} as ComponentMeta<typeof CourseTopic>

const topic = {
  id: 'topic-1',
  title: 'Resistors',
  description: 'Learn all about Resistance, Ohms, etc',
  activities: [
    {
      id: 'activity-1',
      title: 'Identifying Resistors',
      description: `Identifying resistors by their signature color codes is a skill that can be learnt. 
There are four main colors used on resistors, and these are brown, red, orange, and yellow. 
Each color represents a different value, with brown representing the lowest value, and yellow representing the highest. 
The value of a resistor can be determined by its color code, which is a series of numbers and letters that are printed on the resistor itself.`,
      path: '',
    },
    {
      id: 'activity-2',
      title: 'Using Breadboards',
      description: `Placing resistors on a breadboard is one of the foundational skills for anyone working in electronics. The following steps will show you how to place a resistor on a breadboard.
Step 1: Look at the Resistor
The first thing you need to do is to look at the resistor. You will notice that there are two colored stripes running down the side of the resistor. These stripes indicate the resistance value of the resistor.`,
      path: '',
    },
    {
      id: 'activity-3',
      title: 'Using Capacitors',
      description: `Placing capacitors on a breadboard is one of the foundational skills for anyone working in electronics. The following steps will show you how to place a capacitors on a breadboard.
Step 1: Look at the Capacitor
The first thing you need to do is to look at the capacitor. You will notice that there are two colored stripes running down the side of the capacitors. These stripes indicate the resistance value of the capacitors.`,
      path: '',
    },
  ],
  course: {
    id: 'course-1',
  },
} as Tap.Course.Topic
const topicRecord = {
  id: 'crs-top-rec-1',
  courseTopicId: 'crs-top-1',
  courseTopic: topic,
  courseRecordId: '123456',
  activityRecords: topic.activities?.map((activity, $a) => ({
    id: 'crs-top-act-rec-1',
    auId: 'https://tap3d.com/course/1',
    created: new Date().toISOString(),
    activity,
    completedAt: $a === 0 ? '2023-01-16T02:55:42.822Z' : null,
    courseTopicActivityId: 'crs-top-act-1',
    courseTopicRecordId: 'crs-top-rec-1',
    launchUrl: 'https://...',
  })),
} as Tap.Course.TopicRecord

export const WithLockedStatus = () => (
  <CourseTopic
    topic={topicRecord.courseTopic}
    activityRecords={topicRecord.activityRecords}
    locked={true}
    viewCourseActivity={() =>
      new Promise((resolve) => setTimeout(resolve, 750))
    }
    isOpen
  />
)

export const WithNoActivityRecords = () => (
  <CourseTopic
    topic={topicRecord.courseTopic}
    activityRecords={[]}
    locked={false}
    viewCourseActivity={() =>
      new Promise((resolve) => setTimeout(resolve, 750))
    }
    isOpen
  />
)

export const WithFirstActivityInProgress = () => (
  <CourseTopic
    topic={topicRecord.courseTopic}
    activityRecords={topicRecord.activityRecords
      .slice(0, 1)
      .map((activityRecord, $a) => ({
        ...activityRecord,
        completedAt: null,
      }))}
    locked={false}
    viewCourseActivity={() =>
      new Promise((resolve) => setTimeout(resolve, 750))
    }
    isOpen
  />
)

export const WithFirstActivityComplete = () => (
  <CourseTopic
    topic={topicRecord.courseTopic}
    activityRecords={topicRecord.activityRecords
      .slice(0, 1)
      .map((activityRecord, $a) => ({
        ...activityRecord,
        completedAt: $a === 0 ? '2023-01-16T02:55:42.822Z' : null,
      }))}
    locked={false}
    viewCourseActivity={() =>
      new Promise((resolve) => setTimeout(resolve, 750))
    }
    isOpen
  />
)

export const WithFirstActivityCompleteAndSecondInProgress = () => (
  <CourseTopic
    topic={topicRecord.courseTopic}
    activityRecords={topicRecord.activityRecords
      .slice(0, 2)
      .map((activityRecord, $a) => ({
        ...activityRecord,
        completedAt: $a === 0 ? '2023-01-16T02:55:42.822Z' : null,
      }))}
    locked={false}
    viewCourseActivity={() =>
      new Promise((resolve) => setTimeout(resolve, 750))
    }
    isOpen
  />
)

export const WithAllCompletedActivities = () => (
  <CourseTopic
    topic={topicRecord.courseTopic}
    activityRecords={topicRecord.activityRecords.map((activityRecord) => ({
      ...activityRecord,
      completedAt: '2023-01-16T02:55:42.822Z',
    }))}
    locked={false}
    viewCourseActivity={() =>
      new Promise((resolve) => setTimeout(resolve, 750))
    }
    isOpen
  />
)

export const WithViewAction = () => (
  <CourseTopic
    topic={topicRecord.courseTopic}
    activityRecords={topicRecord.activityRecords}
    locked={false}
    viewCourseActivity={() =>
      new Promise((resolve) => setTimeout(resolve, 750))
    }
    isOpen
    shouldDisplayViewAction
  />
)
