import { CourseService } from './course.service'
describe('CourseService', () => {
  const service = new CourseService()
  describe('getCourses', () => {
    it('should getCourses', async () => {
      const courses = await service.getCourses({
        organizationId: 'org-1',
        getCoursesByOrg: async () => [
          {
            id: 'crs-1',
            level: 'Beginner',
            objectives: [
              `- To introduce the course`,
              `- To provide a walkthrough of the course`,
            ].join('\n'),
            category_id: 'crs-cat-1',
            created_at: 'now',
            updated_at: 'now',
            description: 'A simple description of A Beginner course',
            title: 'A Beginner course',
            length_min: 30,
            published: false,
            thumbnail_id: 'ast-1',
          },
        ],
      })
      expect(courses).toMatchObject([
        {
          id: 'crs-1',
          level: 'Beginner',
          objectives: [
            `- To introduce the course`,
            `- To provide a walkthrough of the course`,
          ],
          createdAt: 'now',
          updatedAt: 'now',
          description: 'A simple description of A Beginner course',
          title: 'A Beginner course',
          lengthMin: 30,
          published: false,
        },
      ] as typeof courses)
    })

    it('should return empty', async () => {
      const courses = await service.getCourses({
        organizationId: 'org-1',
        getCoursesByOrg: async () => [],
      })
      expect(courses).toMatchObject([] as typeof courses)
    })
  })

  describe('getCourse', () => {
    it('should getCourse', async () => {
      const course = await service.getCourse('crs-1', {
        references: {
          category: true,
          thumbnail: true,
        },
        getCourse: async () => ({
          id: 'crs-1',
          level: 'Beginner',
          objectives: [
            `- To introduce the course`,
            `- To provide a walkthrough of the course`,
          ].join('\n'),
          category_id: 'crs-cat-1',
          created_at: 'now',
          updated_at: 'now',
          description: 'A simple description of A Beginner course',
          title: 'A Beginner course',
          length_min: 30,
          published: false,
          thumbnail_id: 'ast-1',
        }),
        getCourseCategory: async (id: string) => ({
          id,
          label: 'Sample Category Label',
          createdAt: 'now',
          updatedAt: 'now',
        }),
        getThumbnailAsset: async (id: string) => ({
          id,
          type: 'image',
          url: 'https://cdn.tap3d.com/images/thumbnail.jpg',
          createdAt: 'now',
          updatedAt: 'now',
        }),
        getCourseTopics: async (courseIds: string[]) => [],
      })
      expect(course).toMatchObject({
        id: 'crs-1',
        level: 'Beginner',
        objectives: [
          `- To introduce the course`,
          `- To provide a walkthrough of the course`,
        ],
        createdAt: 'now',
        updatedAt: 'now',
        description: 'A simple description of A Beginner course',
        title: 'A Beginner course',
        lengthMin: 30,
        published: false,
        categoryId: 'crs-cat-1',
        category: {
          id: 'crs-cat-1',
          label: 'Sample Category Label',
          createdAt: 'now',
          updatedAt: 'now',
        },
        thumbnailId: 'ast-1',
        thumbnail: {
          id: 'ast-1',
          type: 'image',
          url: 'https://cdn.tap3d.com/images/thumbnail.jpg',
          createdAt: 'now',
          updatedAt: 'now',
        },
      } as typeof course)
    })

    it('should return null', async () => {
      const course = await service.getCourse('crs-1', {
        getCourse: async () => null,
        getCourseCategory: async (id: string) => ({
          id,
          label: 'Sample Category Label',
          createdAt: 'now',
          updatedAt: 'now',
        }),
        getThumbnailAsset: async (id: string) => ({
          id,
          type: 'image',
          url: 'https://cdn.tap3d.com/images/thumbnail.jpg',
          createdAt: 'now',
          updatedAt: 'now',
        }),
        getCourseTopics: async (courseIds: string[]) => [],
      })
      expect(course).toEqual(null as typeof course)
    })

    it('should getCourse where objectives is null', async () => {
      const course = await service.getCourse('crs-1', {
        references: {
          category: true,
          thumbnail: true,
        },
        getCourse: async () => ({
          id: 'crs-1',
          level: 'Beginner',
          objectives: null,
          category_id: 'crs-cat-1',
          created_at: 'now',
          updated_at: 'now',
          description: 'A simple description of A Beginner course',
          title: 'A Beginner course',
          length_min: 30,
          published: false,
          thumbnail_id: 'ast-1',
        }),
        getCourseCategory: async () => null,
        getThumbnailAsset: async () => null,
        getCourseTopics: async (courseIds: string[]) => [],
      })
      expect(course).toMatchObject({
        id: 'crs-1',
        level: 'Beginner',
        objectives: [],
        createdAt: 'now',
        updatedAt: 'now',
        description: 'A simple description of A Beginner course',
        title: 'A Beginner course',
        lengthMin: 30,
        published: false,
        category: null,
        thumbnail: null,
      } as typeof course)
    })

    it('should getCourse where category_id is undefined', async () => {
      const getCourseCategory = jest.fn(async () => null)
      const course = await service.getCourse('crs-1', {
        getCourse: async () => ({
          id: 'crs-1',
          level: 'Beginner',
          objectives: null,
          category_id: undefined,
          created_at: 'now',
          updated_at: 'now',
          description: 'A simple description of A Beginner course',
          title: 'A Beginner course',
          length_min: 30,
          published: false,
          thumbnail_id: 'ast-1',
        }),
        getCourseCategory,
        getThumbnailAsset: async () => null,
        getCourseTopics: async (courseIds: string[]) => [],
      })
      expect(getCourseCategory).toHaveBeenCalledTimes(0)
    })

    it('should getCourse where thumbnail_id is undefined', async () => {
      const getThumbnailAsset = jest.fn(async () => null)
      const course = await service.getCourse('crs-1', {
        getCourse: async () => ({
          id: 'crs-1',
          level: 'Beginner',
          objectives: null,
          category_id: 'crs-cat-1',
          created_at: 'now',
          updated_at: 'now',
          description: 'A simple description of A Beginner course',
          title: 'A Beginner course',
          length_min: 30,
          published: false,
          thumbnail_id: undefined,
        }),
        getCourseCategory: async () => null,
        getThumbnailAsset,
        getCourseTopics: async (courseIds: string[]) => [],
      })
      expect(getThumbnailAsset).toHaveBeenCalledTimes(0)
    })
  })
})
