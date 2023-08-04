import { Knex } from 'knex'
import { snake, toCamel, toSnake } from 'snake-camel'
import { Tap } from '../../../../lib'
import {
  FieldsQueryResult,
  ReferencesQueryResult,
} from '../../../middleware/fields'
import { listToMap } from '../../../utils'
import Id from '../../../utils/id.utils'
import { WithTimestamps } from '../../db'
import knex from '../../db/conn.knex'
import { NewTable, Table } from '../../db/tables'
import UserService from '../../user/user.service'
import { CourseTopicRecordService } from '../course-topic-record/course-topic-record.service'
import { CourseService } from '../course.service'

export class CourseRecordService {
  db: Knex

  constructor(db: Knex = knex) {
    this.db = db
  }

  async getCourseRecords(
    { userId, courseId }: { userId?: string; courseId?: string },
    {
      fields = ['*'] as FieldsQueryResult<Tap.Course.Record>,
      references = {
        course: true,
        courseTopicRecords: true,
      } as ReferencesQueryResult<Tap.Course.Record>,
      getCourseRecords = (): Promise<Table<Tap.Course.Record>[]> =>
        knex('course_record')
          .where({
            ...(userId ? toSnake({ userId }) : {}),
            ...(courseId ? toSnake({ courseId }) : {}),
          })
          .select(...fields.map(snake)),
      getCourses = (
        courseIds: string[]
      ): Promise<WithTimestamps<Tap.Course>[]> =>
        new CourseService(this.db).getCourses({
          courseIds,
          references: { topics: false },
        }),
      getCourseTopicRecords = (
        courseRecordIds: string[]
      ): Promise<WithTimestamps<Tap.Course.TopicRecord>[]> =>
        new CourseTopicRecordService(this.db).getCourseTopicRecords(
          courseRecordIds
        ),
    } = {}
  ): Promise<WithTimestamps<Tap.Course.Record>[]> {
    const courseRecords: WithTimestamps<Tap.Course.Record>[] =
      await getCourseRecords().then((records) => records.map(this.transform))

    let _courses: Promise<WithTimestamps<Tap.Course>[]>
    let _courseTopicRecords: Promise<WithTimestamps<Tap.Course.TopicRecord>[]>

    // add course references
    if (references.course) {
      _courses = getCourses(courseRecords.map((rec) => rec.courseId))
    }

    // add course topic records references
    if (references.courseTopicRecords) {
      _courseTopicRecords = getCourseTopicRecords(
        courseRecords.map((rec) => rec.id)
      )
    }

    const [courses, courseTopicRecords] = await Promise.all([
      _courses,
      _courseTopicRecords,
    ])

    if (references.course) {
      const courseMap = listToMap(courses, 'id')
      courseRecords.forEach((rec) => {
        rec.course = courseMap[rec.courseId]
      })
    }

    if (references.courseTopicRecords) {
      const courseTopicRecordMap = courseTopicRecords.reduce((map, rec) => {
        if (!map[rec.courseRecordId]) {
          map[rec.courseRecordId] = []
        }
        map[rec.courseRecordId].push(rec)
        return map
      }, {})
      courseRecords.forEach((rec) => {
        rec.courseTopicRecords = courseTopicRecordMap[rec.id]
      })
    }

    return courseRecords
  }

  async getCourseRecord(
    {
      id,
      userId,
      courseId,
    }:
      | { id: string; userId?: never; courseId?: never }
      | { id?: never; userId: string; courseId: string },
    {
      fields = ['*'] as FieldsQueryResult<Tap.Course.Record>,
      references = {
        course: true,
        courseTopicRecords: true,
      } as ReferencesQueryResult<Tap.Course.Record>,
      getCourseRecord = (): Promise<Table<Tap.Course.Record>> =>
        knex('course_record')
          .where({
            ...(id ? toSnake({ id }) : {}),
            ...(userId ? toSnake({ userId }) : {}),
            ...(courseId ? toSnake({ courseId }) : {}),
          })
          .select(...fields.map(snake))
          .first(),
      getCourse = (courseId: string) =>
        new CourseService(this.db).getCourse(courseId, {
          references: {
            category: true,
            instructors: true,
            previewImages: true,
          },
        }),
      getCourseTopicRecords = (courseRecordId: string[]) =>
        new CourseTopicRecordService(this.db).getCourseTopicRecords(
          courseRecordId
        ),
      getUser = (userId: string) => new UserService().getUserById(userId),
    } = {}
  ): Promise<WithTimestamps<Tap.Course.Record>> {
    const courseRecord: WithTimestamps<Tap.Course.Record> =
      await getCourseRecord().then((record) => {
        if (record) {
          return this.transform(record)
        }
      })
    if (!courseRecord) return null

    let _user: Promise<Tap.User>
    let _course: Promise<WithTimestamps<Tap.Course>>
    let _courseTopicRecords: Promise<WithTimestamps<Tap.Course.TopicRecord>[]>

    if (references.user) {
      _user = getUser(courseRecord.userId)
    }
    if (references.course) {
      _course = getCourse(courseRecord.courseId)
    }
    if (references.courseTopicRecords) {
      _courseTopicRecords = getCourseTopicRecords([courseRecord.id])
    }

    const [user, course, courseTopicRecords] = await Promise.all([
      _user,
      _course,
      _courseTopicRecords,
    ])

    if (references.user) {
      courseRecord.user = user
    }
    if (references.course) {
      courseRecord.course = course
    }
    if (references.courseTopicRecords) {
      courseRecord.courseTopicRecords = courseTopicRecords
    }

    return courseRecord
  }

  async createCourseRecord(
    courseId: string,
    userId: string,
    organizationId: string
  ): Promise<Partial<Tap.Course.Record>> {
    const courseRecord: NewTable<Tap.Course.Record> = toSnake({
      id: Id.CourseRecord(),
      userId,
      courseId,
      organizationId,
    })
    const courseRecordIds = await this.db
      .insert(courseRecord, ['id'])
      .into('course_record')
    if (courseRecordIds.length === 0) {
      throw new Error('Failed to insert course record.')
    }
    return {
      id: courseRecord.id,
    }
  }

  async getOrCreateCourseRecord(
    { userId, courseId }: { userId: string; courseId: string },
    {
      getCourseRecord = this.getCourseRecord.bind(this),
      createCourseRecord = this.createCourseRecord.bind(this),
    } = {}
  ): Promise<WithTimestamps<Tap.Course.Record>> {
    let courseRecord = await getCourseRecord({ userId, courseId })
    if (!courseRecord) {
      const { organization } = await new UserService().getUserById(userId)
      const { id } = await createCourseRecord(courseId, userId, organization.id)
      return getCourseRecord({ id })
    }
    return courseRecord
  }

  private transform(
    dbCourseRecord: Table<Tap.Course.Record>
  ): WithTimestamps<Tap.Course.Record> {
    return toCamel(dbCourseRecord)
  }
}
