import {
  courseTopicActivityRecordsWithTimestamps,
  courseTopicWithTimestamps,
} from '../../../data/mocks'
import { CourseTopicRecordService } from './course-topic-record.service'

jest.mock('nanoid', () => ({
  customAlphabet: () => () => Date.now().toString(),
}))

describe('CourseTopicRecordService', () => {
  const service = new CourseTopicRecordService()

  describe('getCourseTopicRecord', () => {
    it('should getCourseTopicRecord', async () => {
      const record = await service.getCourseTopicRecord(
        { id: 'crs-top-rec-1' },
        {
          getCourseTopicRecord: async () => ({
            course_record_id: 'crs-rec-1',
            created_at: 'now',
            updated_at: 'now',
            id: 'crs-top-rec-1',
            course_topic_id: 'crs-top-1',
          }),
          getCourseTopic: async () => courseTopicWithTimestamps,
          getCourseTopicActivityRecords: async () =>
            courseTopicActivityRecordsWithTimestamps,
        }
      )
      expect(record.id).toEqual('crs-top-rec-1')
      expect(record.courseTopic.id).toEqual('crs-top-1')
      expect(record.activityRecords.length).toEqual(3)
      expect(record.activityRecords[0].id).toEqual('crs-top-act-rec-1')
    })

    it('should return null', async () => {
      const topics = await service.getCourseTopicRecord(
        { id: 'crs-top-1' },
        {
          getCourseTopicRecord: async () => null,
        }
      )
      expect(topics).toEqual(null)
    })
  })

  describe.skip('createCourseTopicRecord', () => {
    it('should createCourseTopicRecord', async () => {
      throw new Error('Not Implemented')
    })
  })
})
