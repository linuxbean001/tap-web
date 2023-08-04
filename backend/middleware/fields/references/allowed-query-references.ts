import { Tap } from '../../../../lib'
import { ReferenceFields } from './references'

const Course: ReferenceFields<Tap.Course>[] = [
  'category',
  'instructors',
  'previewImages',
  'instructors',
  'topics',
  'thumbnail',
]
const CourseRecord: ReferenceFields<Tap.Course.Record>[] = [
  'user',
  'course',
  'courseTopicRecords',
]
const CourseTopicRecord: ReferenceFields<Tap.Course.TopicRecord>[] = [
  'activityRecords',
  'courseRecord',
  'courseTopic',
]

export const AllowedReferences = {
  Course,
  CourseRecord,
  CourseTopicRecord,
}
