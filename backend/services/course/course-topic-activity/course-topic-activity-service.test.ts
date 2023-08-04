import { CourseTopicActivityService } from './course-topic-activity.service'

describe('CourseTopicActivityService', () => {
  const service = new CourseTopicActivityService()

  describe('getCourseTopicActivities', () => {
    it('should getCourseTopicActivities', async () => {
      const activities = await service.getCourseTopicActivities({
        courseTopicIds: ['crs-top-1'],
        getCourseTopicActivities: async () => [
          {
            id: 'crs-top-act-1',
            au_id: 'https://tap3d.com/au/123456',
            title: 'Sample Course Topic Activity',
            description: 'Sample description',
            path: 'top',
            course_topic_id: 'crs-top-1',
            order: 0,
            created_at: 'now',
            updated_at: 'now',
            type: 'Activity_Check',
            is_vr_only: false,
          },
        ],
      })
      expect(activities).toMatchObject([
        {
          id: 'crs-top-act-1',
          auId: 'https://tap3d.com/au/123456',
          title: 'Sample Course Topic Activity',
          description: 'Sample description',
          path: 'top',
          order: 0,
          createdAt: 'now',
          updatedAt: 'now',
        },
      ] as typeof activities)
    })

    it('should return empty', async () => {
      const topics = await service.getCourseTopicActivities({
        courseTopicIds: ['crs-top-1'],
        getCourseTopicActivities: async () => [],
      })
      expect(topics).toEqual([])
    })
  })

  describe('getCourseTopicActivity', () => {
    it('should getCourseTopicActivity', async () => {
      const activity = await service.getCourseTopicActivity('crs-top-act-1', {
        getCourseTopicActivity: async () => ({
          id: 'crs-top-act-1',
          au_id: 'https://tap3d.com/au/123456',
          title: 'Sample Course Topic Activity',
          description: 'Sample description',
          path: 'top',
          course_topic_id: 'crs-top-1',
          order: 0,
          created_at: 'now',
          updated_at: 'now',
          type: 'Activity_Check',
          is_vr_only: false,
        }),
      })
      expect(activity).toMatchObject({
        id: 'crs-top-act-1',
        auId: 'https://tap3d.com/au/123456',
        title: 'Sample Course Topic Activity',
        description: 'Sample description',
        path: 'top',
        order: 0,
        createdAt: 'now',
        updatedAt: 'now',
        type: 'Activity_Check',
      } as typeof activity)
    })

    it('should return null', async () => {
      const topic = await service.getCourseTopicActivity('crs-top-act-1', {
        getCourseTopicActivity: async () => null,
      })
      expect(topic).toEqual(undefined)
    })
  })
})
