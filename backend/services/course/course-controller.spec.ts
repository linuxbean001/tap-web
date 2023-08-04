import { NotFoundException } from 'next-api-decorators'
import 'reflect-metadata'
import { Tap } from '../../../lib'
import CourseController from './course.controller'
import { CourseService } from './course.service'

jest.mock('next-api-decorators', () => ({
  ...jest.requireActual('next-api-decorators'),
  Get: () => () => {},
}))

describe('CourseController', () => {
  const controller = new CourseController(new CourseService())
  const user: Tap.User = {
    email: 'test+member@tap3d.com',
    id: '123',
    firstName: 'Test',
    lastName: 'Member',
    role: 0,
    groups: [],
    organization: {
      id: 'org-123',
      name: 'test org',
    },
  }
  describe('getCourses', () => {
    it('should return an array of courses', async () => {
      const courses = await controller.getCourses(user, ['title'], {})
      expect(Array.isArray(courses)).toBe(true)
      expect(courses.slice(0, 4)).toMatchObject([
        {
          title: 'Foundational Electronics',
        },
        {
          title: 'Beginner Electronics',
        },
        {
          title: 'Intermediate Electronics',
        },
        {
          title: 'Advanced Electronics',
        },
      ] as Tap.Course[])
    })

    it('should add references', async () => {
      const courses = await controller.getCourses(user, ['*'], {
        category: true,
        instructors: true,
        previewImages: true,
        thumbnail: true,
        topics: true,
      })
      expect(Array.isArray(courses)).toBe(true)
      expect(courses.slice(0, 4)).toMatchObject([
        {
          categoryId: expect.any(String),
          category: {
            id: expect.any(String),
            label: 'Electronics',
          },
          thumbnail: {
            id: expect.any(String),
            type: 'image',
            url: 'https://dev.cdn.tap3d.com/assets/images/leak-checking-course-banner.png',
          },
          title: 'Foundational Electronics',
        },
        {
          categoryId: expect.any(String),
          category: {
            id: expect.any(String),
            label: 'Electronics',
          },
          thumbnail: {
            id: expect.any(String),
            type: 'image',
            url: 'https://dev.cdn.tap3d.com/assets/images/leak-checking-course-banner.png',
          },
          title: 'Beginner Electronics',
        },
        {
          categoryId: expect.any(String),
          category: {
            id: expect.any(String),
            label: 'Electronics',
          },
          thumbnail: {
            id: expect.any(String),
            type: 'image',
            url: 'https://dev.cdn.tap3d.com/assets/images/leak-checking-course-banner.png',
          },
          title: 'Intermediate Electronics',
        },
        {
          categoryId: expect.any(String),
          category: {
            id: expect.any(String),
            label: 'Electronics',
          },
          thumbnail: {
            id: expect.any(String),
            type: 'image',
            url: 'https://dev.cdn.tap3d.com/assets/images/leak-checking-course-banner.png',
          },
          title: 'Advanced Electronics',
        },
      ] as Tap.Course[])
    })
  })

  describe('getCourse', () => {
    it('should return a course', async () => {
      const [{ id }] = await controller.getCourses(user, ['id', 'title'], {})
      const course = await controller.getCourse(id, ['*'], {})
      expect(course).toMatchObject({
        title: 'Foundational Electronics',
      } as Tap.Course)
    })

    it('should throw NotFoundException', async () => {
      expect(
        await controller
          .getCourse('invalid-course-id', ['*'], {})
          .catch((error) => error)
      ).toBeInstanceOf(NotFoundException)
    })

    it('should add references', async () => {
      const [{ id }] = await controller.getCourses(user, ['id', 'title'], {})
      const course = await controller.getCourse(id, ['*'], {
        category: true,
        thumbnail: true,
      })
      expect(course).toMatchObject({
        title: 'Foundational Electronics',
        category: {
          id: expect.any(String),
          label: 'Electronics',
        },
        thumbnail: {
          id: expect.any(String),
          type: 'image',
          url: 'https://dev.cdn.tap3d.com/assets/images/leak-checking-course-banner.png',
        },
      } as Tap.Course)
    })
  })
})
