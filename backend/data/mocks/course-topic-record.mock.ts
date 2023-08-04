import type Course from '../../../lib/domain/course'
import { WithTimestamps } from '../../services/db'
import { courseTopicActivityRecords } from './course-topic-activity-record.mock'
import { courseTopic, courseTopics } from './course-topic.mock'

export const courseTopicRecord: Course.TopicRecord = {
  id: 'crs-top-rec-1',
  courseRecordId: 'crs-rec-1',
  courseTopicId: 'crs-top-1',
  courseTopic: courseTopic,
  activityRecords: courseTopicActivityRecords,
}

export const courseTopicRecordWithTimestamps: WithTimestamps<Course.TopicRecord> =
  {
    ...courseTopicRecord,
    createdAt: 'now',
    updatedAt: 'now',
  }

export const courseTopicRecords: Course.TopicRecord[] = [
  courseTopicRecord,
  {
    id: 'crs-top-rec-2',
    courseRecordId: 'crs-rec-1',
    courseTopicId: 'crs-top-2',
    courseTopic: courseTopics[1],
  },
  {
    id: 'crs-top-rec-3',
    courseRecordId: 'crs-rec-1',
    courseTopicId: 'crs-top-3',
    courseTopic: courseTopics[2],
  },
]

export const courseTopicRecordsWithTimestamps =
  courseTopicRecords as WithTimestamps<Course.TopicRecord>[]
