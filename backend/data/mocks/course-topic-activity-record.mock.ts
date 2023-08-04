import type Course from '../../../lib/domain/course'
import { WithTimestamps } from '../../services/db'
import { courseTopicActivity } from './course-topic-activity.mock'

export const courseTopicActivityRecord: Course.TopicActivityRecord = {
  id: 'crs-top-act-rec-1',
  completedAt: '2023-01-16T02:55:42.822Z',
  courseTopicActivityId: 'crs-top-act-1',
  courseTopicActivity: courseTopicActivity,
  courseTopicRecordId: 'crs-top-rec-1',
  launchUrl: 'https://...',
}

export const courseTopicActivityRecordWithTimestamps: WithTimestamps<Course.TopicActivityRecord> =
  {
    id: 'crs-top-act-rec-1',
    completedAt: '2023-01-16T02:55:42.822Z',
    courseTopicActivityId: 'crs-top-act-1',
    courseTopicRecordId: 'crs-top-rec-1',
    launchUrl: 'https://...',
    createdAt: 'now',
    updatedAt: 'now',
  }

export const courseTopicActivityRecords: Course.TopicActivityRecord[] = [
  courseTopicActivityRecord,
  {
    id: 'crs-top-act-rec-2',
    completedAt: '2023-01-16T02:55:42.822Z',
    courseTopicActivityId: 'crs-top-act-2',
    courseTopicRecordId: 'crs-top-rec-1',
    launchUrl: 'https://...',
  },
  {
    id: 'crs-top-act-rec-2',
    completedAt: '2023-01-16T02:55:42.822Z',
    courseTopicActivityId: 'crs-top-act-2',
    courseTopicRecordId: 'crs-top-rec-1',
    launchUrl: 'https://...',
  },
]

export const courseTopicActivityRecordsWithTimestamps =
  courseTopicActivityRecords as WithTimestamps<Course.TopicActivityRecord>[]
