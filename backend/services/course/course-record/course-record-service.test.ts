import {
  courseTopicRecordsWithTimestamps,
  courseWithTimestamps,
} from '../../../data/mocks/'
import { CourseRecordService } from './course-record.service'

jest.mock('nanoid', () => ({
  customAlphabet: () => () => Date.now().toString(),
}))

describe('CourseRecordService', () => {
  const service = new CourseRecordService()

  describe('getCourseRecords', () => {
    it('should getCourseRecords', async () => {
      const records = await service.getCourseRecords(
        {
          userId: 'usr-1',
          courseId: 'crs-1',
        },
        {
          getCourseRecords: async () => [
            {
              id: 'crs-rec-1',
              course_id: 'crs-1',
              user_id: 'usr-1',
              created_at: 'now',
              updated_at: 'now',
              organization_id: 'usr-org-1',
            },
          ],
          getCourses: async () => [courseWithTimestamps],
          getCourseTopicRecords: async () => courseTopicRecordsWithTimestamps,
        }
      )
      expect(records.length).toEqual(1)
      expect(records[0].course.id).toEqual('crs-1')
      expect(records[0].courseTopicRecords.length).toEqual(3)
      expect(records[0].courseTopicRecords[0].id).toEqual('crs-top-rec-1')
      expect(records[0].courseTopicRecords[0].activityRecords.length).toEqual(3)
      expect(records[0].courseTopicRecords[0].courseTopic.id).toEqual(
        'crs-top-1'
      )
      expect(records[0].courseTopicRecords[0].activityRecords[0].id).toEqual(
        'crs-top-act-rec-1'
      )
      expect(
        records[0].courseTopicRecords[0].activityRecords[0].courseTopicActivity
          .id
      ).toEqual('crs-top-act-10')
    })

    it('should return empty', async () => {
      const records = await service.getCourseRecords(
        {
          userId: 'usr-1',
          courseId: 'crs-1',
        },
        {
          getCourseRecords: async () => [],
          getCourses: async () => [],
          getCourseTopicRecords: async () => [],
        }
      )
      expect(records).toEqual([])
    })
  })

  describe('getCourseRecord', () => {
    it('should getCourseRecord', async () => {
      const record = await service.getCourseRecord(
        { id: 'crs-rec-1' },
        {
          getCourseRecord: async () => ({
            id: 'crs-rec-1',
            course_id: 'crs-1',
            user_id: 'usr-1',
            created_at: 'now',
            updated_at: 'now',
            organization_id: 'usr-org-1',
          }),
          getCourse: async () => courseWithTimestamps,
          getCourseTopicRecords: async () => courseTopicRecordsWithTimestamps,
        }
      )
      expect(record.id).toEqual('crs-rec-1')
      expect(record.course.id).toEqual('crs-1')
      expect(record.courseTopicRecords.length).toEqual(3)
      expect(record.courseTopicRecords[0].id).toEqual('crs-top-rec-1')
      expect(record.courseTopicRecords[0].activityRecords.length).toEqual(3)
      expect(record.courseTopicRecords[0].courseTopic.id).toEqual('crs-top-1')
      expect(record.courseTopicRecords[0].activityRecords[0].id).toEqual(
        'crs-top-act-rec-1'
      )
      expect(
        record.courseTopicRecords[0].activityRecords[0].courseTopicActivity.id
      ).toEqual('crs-top-act-10')
    })

    it('should return null', async () => {
      const record = await service.getCourseRecord(
        { id: 'crs-rec-1' },
        {
          getCourseRecord: async () => null,
        }
      )
      expect(record).toEqual(null)
    })
  })
})
