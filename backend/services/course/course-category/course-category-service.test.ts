import { CourseCategoryService } from './course-category.service'

describe('CourseCategoryService', () => {
  const service = new CourseCategoryService()

  describe('getCourseCategories', () => {
    it('should getCourseCategories', async () => {
      const categories = await service.getCourseCategories(['crs-1'], {
        getCourseCategories: async () => [
          {
            id: 'crs-cat-1',
            label: 'Electronics',
            created_at: 'now',
            updated_at: 'now',
          },
        ],
      })
      expect(categories).toMatchObject([
        {
          id: 'crs-cat-1',
          label: 'Electronics',
          createdAt: 'now',
          updatedAt: 'now',
        },
      ] as typeof categories)
    })

    it('should return empty', async () => {
      const categories = await service.getCourseCategories([], {
        getCourseCategories: async () => [],
      })
      expect(categories).toMatchObject([] as typeof categories)
    })
  })

  describe('getCourseCategory', () => {
    it('should getCourseCategory', async () => {
      const category = await service.getCourseCategory('crs-cat-1', {
        getCourseCategory: async () => ({
          id: 'crs-cat-1',
          label: 'Electronics',
          created_at: 'now',
          updated_at: 'now',
        }),
      })
      expect(category).toMatchObject({
        id: 'crs-cat-1',
        label: 'Electronics',
        createdAt: 'now',
        updatedAt: 'now',
      } as typeof category)
    })

    it('should return null', async () => {
      const category = await service.getCourseCategory('crs-cat-1', {
        getCourseCategory: async () => null,
      })
      expect(category).toEqual(null as typeof category)
    })
  })
})
