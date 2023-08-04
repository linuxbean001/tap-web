import { Knex } from 'knex'
import { snake, toCamel } from 'snake-camel'

import { Tap } from '../../../lib'
import {
  FieldsQueryResult,
  ReferencesQueryResult,
} from '../../middleware/fields'
import { listToMap } from '../../utils'
import { AssetService } from '../asset/asset.service'
import { WithTimestamps } from '../db'
import knex from '../db/conn.knex'
import { Table } from '../db/tables'
import { InstructorService } from '../instructor/instructor.service'
import { CourseCategoryService } from './course-category/course-category.service'
import { CourseTopicService } from './course-topic/course-topic.service'

export class CourseService {
  db: Knex

  constructor(db: Knex = knex) {
    this.db = db
  }

  async getCourses({
    courseIds = [],
    organizationId = null,
    fields = ['*'] as FieldsQueryResult<Tap.Course>,
    references = {} as ReferencesQueryResult<
      Tap.Course & { topicActivities: Tap.Course.TopicActivity[] }
    >,
    getCoursesByIds = (courseIds: string[]): Promise<Table<Tap.Course>[]> =>
      knex('course')
        .whereIn('id', courseIds)
        .select(...fields.map((f) => snake(f))),
    getCoursesByOrg = (
      orgId: string,
      courseIds: string[]
    ): Promise<Table<Tap.Course>[]> =>
      knex('course')
        .innerJoin(
          'organization_to_course',
          'course.id',
          'organization_to_course.course_id'
        )
        .where({
          third_party_id: orgId,
          ...(courseIds.length ? { 'course.id': courseIds } : {}),
        })
        .select(...fields.map((f) => 'course.'.concat(snake(f)))),
    getCourseCategories = (
      courseIds: string[]
    ): Promise<WithTimestamps<Tap.Course.Category>[]> =>
      new CourseCategoryService(this.db).getCourseCategories(courseIds),
    getThumbnails = (
      assetIds: string[]
    ): Promise<WithTimestamps<Tap.Asset>[]> =>
      new AssetService(this.db).getAssets(assetIds),
    getCourseTopics = (
      courseIds: string[],
      activities: boolean
    ): Promise<WithTimestamps<Tap.Course.Topic>[]> =>
      new CourseTopicService(this.db).getCourseTopics({
        courseIds,
        references: { activities },
      }),
  } = {}): Promise<WithTimestamps<Tap.Course>[]> {
    let dbCourses: Table<Tap.Course>[]
    if (organizationId) {
      dbCourses = await getCoursesByOrg(organizationId, courseIds)
    } else {
      dbCourses = await getCoursesByIds(courseIds)
    }
    const courses = dbCourses.map(this.transform)

    let _categories: Promise<WithTimestamps<Tap.Course.Category>[]>
    let _thumbnails: Promise<WithTimestamps<Tap.Asset>[]>
    let _topics: Promise<WithTimestamps<Tap.Course.Topic>[]>

    if (references.category) {
      _categories = getCourseCategories(courses.map((c) => c.id))
    }
    if (references.thumbnail) {
      _thumbnails = getThumbnails(courses.map((c) => c.thumbnailId))
    }
    if (references.topics) {
      _topics = getCourseTopics(
        courses.map((c) => c.id),
        references.topicActivities || false
      )
    }

    const [categories, thumbnails, topics] = await Promise.all([
      _categories,
      _thumbnails,
      _topics,
    ])

    if (references.category) {
      const categoryMap = listToMap(categories, 'id')
      courses.forEach((c) => {
        if (c.categoryId in categoryMap) {
          c.category = categoryMap[c.categoryId]
        }
      })
    }
    if (references.thumbnail) {
      const thumbnailMap = listToMap(thumbnails, 'id')
      courses.forEach((c) => {
        if (c.thumbnailId in thumbnailMap) {
          c.thumbnail = thumbnailMap[c.thumbnailId]
        }
      })
    }
    if (references.topics) {
      courses.forEach((course) => {
        course.topics = topics.filter((topic) => topic.courseId === course.id)
      })
    }

    return courses
  }

  async getCourse(
    courseId: string,
    {
      fields = ['*'] as FieldsQueryResult<Tap.Course>,
      references = {} as ReferencesQueryResult<Tap.Course>,
      getCourse = (fields: string[]): Promise<Table<Tap.Course>> =>
        knex('course')
          .where({ id: courseId })
          .select(...fields.map(snake))
          .first(),
      getCourseTopics = (courseIds: string[]) =>
        new CourseTopicService(this.db).getCourseTopics({ courseIds }),
      getCourseCategory = (courseCategoryId: string) =>
        new CourseCategoryService(this.db).getCourseCategory(courseCategoryId),
      getThumbnailAsset = (assetId: string) =>
        new AssetService(this.db).getAsset(assetId),
      getCourseInstructors = (courseId: string) =>
        new InstructorService(this.db).getCourseInstructors(courseId),
      getCourseAssets = (courseId: string) =>
        this.db
          .select()
          .from('asset')
          .innerJoin('course_assets', 'asset.id', 'course_assets.asset_id')
          .where({ course_id: courseId }),
    } = {}
  ): Promise<WithTimestamps<Tap.Course>> {
    const dbCourse = await getCourse(fields)
    if (!dbCourse) {
      return null
    }
    const course: WithTimestamps<Tap.Course> = this.transform(dbCourse)

    if (course) {
      let _thumbnail: Promise<WithTimestamps<Tap.Asset>>
      let _category: Promise<WithTimestamps<Tap.Course.Category>>
      let _topics: Promise<WithTimestamps<Tap.Course.Topic>[]>
      let _instructors: Promise<WithTimestamps<Tap.Instructor>[]>
      let _previews: Promise<WithTimestamps<Tap.Asset>[]>

      if (references.thumbnail) {
        _thumbnail = dbCourse.thumbnail_id
          ? getThumbnailAsset(dbCourse.thumbnail_id)
          : null
      }
      if (references.category) {
        _category = dbCourse.category_id
          ? getCourseCategory(dbCourse.category_id)
          : null
      }
      if (references.topics) {
        _topics = getCourseTopics([courseId])
      }
      if (references.instructors) {
        _instructors = getCourseInstructors(course.id)
      }
      if (references.previewImages) {
        _previews = getCourseAssets(course.id)
      }

      const [thumbnail, category, topics, instructors, previews] =
        await Promise.all([
          _thumbnail,
          _category,
          _topics,
          _instructors,
          _previews,
        ])

      if (references.thumbnail) {
        course.thumbnail = thumbnail
      }
      if (references.category) {
        course.category = category
      }
      if (references.topics) {
        course.topics = topics
      }
      if (references.instructors) {
        course.instructors = instructors
      }
      if (references.previewImages) {
        course.previewImages = previews
      }
    }
    return course
  }

  private transform(dbCourse: Table<Tap.Course>): WithTimestamps<Tap.Course> {
    const { objectives, ...course } = toCamel(dbCourse)
    return {
      ...course,
      objectives: objectives?.split('\n') || [],
    }
  }
}
