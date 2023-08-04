import { Tap } from '../../../../lib/domain/index'
import { CourseTopicService } from './course-topic.service'

type WithTimestamps<T> = T & { createdAt: string; updatedAt: string }
describe('CourseTopicService', () => {
  const service = new CourseTopicService()

  describe('getCourseTopics', () => {
    it('should getCourseTopics', async () => {
      const topics = await service.getCourseTopics({
        courseIds: ['crs-1'],
        getCourseTopics: async () => [
          {
            id: 'crs-top-1',
            course_id: 'crs-1',
            title: 'Sample Course Topic',
            description: 'A simple description',
            order: 0,
            created_at: 'now',
            updated_at: 'now',
          },
        ],
        getCourseTopicActivities: async (): Promise<
          WithTimestamps<Tap.Course.TopicActivity>[]
        > => [
          {
            id: 'crs-top-act-1',
            auId: 'https://tap3d.com/au/123456',
            courseTopicId: 'crs-top-1',
            title: 'Sample Sub-topic',
            description: 'A simple description',
            order: 0,
            path: 'courses/index.html',
            createdAt: 'now',
            updatedAt: 'now',
            type: 'Activity_Check',
          },
        ],
      })
      expect(topics).toMatchObject([
        {
          id: 'crs-top-1',
          title: 'Sample Course Topic',
          description: 'A simple description',
          order: 0,
          activities: [
            {
              id: 'crs-top-act-1',
              auId: 'https://tap3d.com/au/123456',
              courseTopicId: 'crs-top-1',
              title: 'Sample Sub-topic',
              description: 'A simple description',
              order: 0,
              path: 'courses/index.html',
            },
          ],
          createdAt: 'now',
          updatedAt: 'now',
        },
      ] as typeof topics)
    })

    it('should return empty', async () => {
      const topics = await service.getCourseTopics({
        courseIds: ['crs-1'],
        getCourseTopics: async () => [],
        getCourseTopicActivities: async () => [],
      })
      expect(topics).toEqual([])
    })
  })

  describe('getCourseTopic', () => {
    it('should getCourseTopic', async () => {
      const topic = await service.getCourseTopic('crs-top-1', {
        getCourseTopic: async () => ({
          id: 'crs-top-1',
          course_id: 'crs-1',
          title: 'Sample Course Topic',
          description: 'A simple description',
          order: 0,
          created_at: 'now',
          updated_at: 'now',
        }),
        getCourseTopicActivities: async () => [
          {
            id: 'crs-top-act-1',
            auId: 'https://tap3d.com/au/123456',
            courseTopicId: 'crs-top-1',
            title: 'Sample Sub-topic',
            description: 'A simple description',
            order: 0,
            path: 'courses/index.html',
            createdAt: 'now',
            updatedAt: 'now',
            type: 'Activity_Check',
          },
        ],
      })
      expect(topic).toMatchObject({
        id: 'crs-top-1',
        title: 'Sample Course Topic',
        description: 'A simple description',
        order: 0,
        activities: [
          {
            id: 'crs-top-act-1',
            auId: 'https://tap3d.com/au/123456',
            courseTopicId: 'crs-top-1',
            title: 'Sample Sub-topic',
            description: 'A simple description',
            order: 0,
            path: 'courses/index.html',
          },
        ],
        createdAt: 'now',
        updatedAt: 'now',
      } as typeof topic)
    })

    it('should return null', async () => {
      const topic = await service.getCourseTopic('crs-top-1', {
        getCourseTopic: async () => null,
      })
      expect(topic).toEqual(null)
    })
  })
})
