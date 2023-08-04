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
import { CourseTopicActivityRecordService } from '../course-topic-activity-record/course-topic-activity-record.service'
import { CourseTopicService } from '../course-topic/course-topic.service'

export class CourseTopicRecordService {
  db: Knex

  constructor(db: Knex = knex) {
    this.db = db
  }

  async getCourseTopicRecord(
    {
      id,
      courseRecordId,
      courseTopicId,
    }:
      | { id: string; courseRecordId?: never; courseTopicId?: never }
      | { id?: never; courseRecordId: string; courseTopicId: string },
    {
      fields = ['*'] as FieldsQueryResult<Tap.Course.TopicRecord>,
      references = {
        courseTopic: true,
        activityRecords: true,
      } as ReferencesQueryResult<Tap.Course.TopicRecord>,
      getCourseTopicRecord = (): Promise<Table<Tap.Course.TopicRecord>> =>
        knex('course_topic_record')
          .where(
            id
              ? { id }
              : {
                  course_record_id: courseRecordId,
                  course_topic_id: courseTopicId,
                }
          )
          .select(...fields.map(snake))
          .first(),
      getCourseTopic = (courseTopicId: string) =>
        new CourseTopicService(this.db).getCourseTopic(courseTopicId, {
          references: { activities: false },
        }),
      getCourseTopicActivityRecords = (
        courseTopicRecordIds: string[]
      ): Promise<WithTimestamps<Tap.Course.TopicActivityRecord>[]> =>
        new CourseTopicActivityRecordService(
          this.db
        ).getCourseTopicActivityRecords(courseTopicRecordIds),
    } = {}
  ): Promise<WithTimestamps<Tap.Course.TopicRecord>> {
    const topicRecord: WithTimestamps<Tap.Course.TopicRecord> =
      await getCourseTopicRecord().then((record) => {
        if (record) {
          return this.transform(record)
        }
      })
    if (!topicRecord) return null

    let _courseTopic: Promise<WithTimestamps<Tap.Course.Topic>>
    let _courseTopicActivityRecords: Promise<
      WithTimestamps<Tap.Course.TopicActivityRecord>[]
    >

    if (references.courseTopic) {
      _courseTopic = getCourseTopic(topicRecord.courseTopicId)
    }
    if (references.activityRecords) {
      _courseTopicActivityRecords = getCourseTopicActivityRecords([
        topicRecord.id,
      ])
    }

    const [courseTopic, courseTopicActivityRecords] = await Promise.all([
      _courseTopic,
      _courseTopicActivityRecords,
    ])

    if (references.courseTopic) {
      topicRecord.courseTopic = courseTopic
    }
    if (references.activityRecords) {
      topicRecord.activityRecords = courseTopicActivityRecords
    }

    return topicRecord
  }

  async getCourseTopicRecords(
    courseRecordIds: string[],
    {
      fields = ['*'] as FieldsQueryResult<Tap.Course.TopicRecord>,
      references = {
        courseTopic: true,
        activityRecords: true,
      } as ReferencesQueryResult<Tap.Course.TopicRecord>,
      getCourseTopicRecords = (
        courseRecordIds: string[]
      ): Promise<Table<Tap.Course.TopicRecord>[]> =>
        knex('course_topic_record')
          .whereIn('course_record_id', courseRecordIds)
          .select(...fields.map(snake)),
      getCourseTopics = (
        courseTopicIds: string[]
      ): Promise<WithTimestamps<Tap.Course.Topic>[]> =>
        new CourseTopicService(this.db).getCourseTopics({
          courseTopicIds,
          references: { activities: false },
        }),
      getCourseTopicActivityRecords = (
        courseTopicRecordIds: string[]
      ): Promise<WithTimestamps<Tap.Course.TopicActivityRecord>[]> =>
        new CourseTopicActivityRecordService(
          this.db
        ).getCourseTopicActivityRecords(courseTopicRecordIds),
    } = {}
  ): Promise<WithTimestamps<Tap.Course.TopicRecord>[]> {
    const courseTopicRecords: WithTimestamps<Tap.Course.TopicRecord>[] =
      await getCourseTopicRecords(courseRecordIds).then((records) =>
        records.map(this.transform)
      )

    let _courseTopics: Promise<WithTimestamps<Tap.Course.Topic>[]>
    let _courseTopicActivityRecords: Promise<
      WithTimestamps<Tap.Course.TopicActivityRecord>[]
    >

    // add topics references
    if (references.courseTopic) {
      _courseTopics = getCourseTopics(
        courseTopicRecords.map((r) => r.courseTopicId)
      )
    }

    // add topic activity records references
    if (references.activityRecords) {
      _courseTopicActivityRecords = getCourseTopicActivityRecords(
        courseTopicRecords.map((r) => r.id)
      )
    }

    const [courseTopics, courseTopicActivityRecords] = await Promise.all([
      _courseTopics,
      _courseTopicActivityRecords,
    ])

    if (references.courseTopic) {
      const courseTopicMap = listToMap(courseTopics, 'id')
      courseTopicRecords.forEach((rec) => {
        rec.courseTopic = courseTopicMap[rec.courseTopicId]
      })
    }

    if (references.activityRecords) {
      const courseTopicActivityRecordMap = courseTopicActivityRecords.reduce(
        (map, rec) => {
          if (!map[rec.courseTopicRecordId]) {
            map[rec.courseTopicRecordId] = []
          }
          map[rec.courseTopicRecordId].push(rec)
          return map
        },
        {}
      )
      courseTopicRecords.forEach((rec) => {
        rec.activityRecords = courseTopicActivityRecordMap[rec.id]
      })
    }

    return courseTopicRecords
  }

  async createCourseTopicRecord(
    courseTopicId: string,
    courseRecordId: string
  ): Promise<Partial<Tap.Course.TopicRecord>> {
    const courseTopicRecord: NewTable<Tap.Course.TopicRecord> = toSnake({
      id: Id.CourseTopicRecord(),
      courseTopicId,
      courseRecordId,
    })
    const courseTopicRecordIds = await this.db
      .insert(courseTopicRecord, ['id'])
      .into('course_topic_record')
    if (courseTopicRecordIds.length === 0) {
      throw new Error('Failed to insert course topic record.')
    }
    return {
      id: courseTopicRecord.id,
    }
  }

  async getOrCreateCourseTopicRecord(
    {
      courseRecordId,
      courseTopicId,
    }: { courseRecordId: string; courseTopicId: string },
    {
      getCourseTopicRecord = this.getCourseTopicRecord.bind(this),
      createCourseTopicRecord = this.createCourseTopicRecord.bind(this),
    } = {}
  ): Promise<WithTimestamps<Tap.Course.TopicRecord>> {
    let courseTopicRecord = await getCourseTopicRecord({
      courseRecordId,
      courseTopicId,
    })
    if (!courseTopicRecord) {
      const { id } = await createCourseTopicRecord(
        courseTopicId,
        courseRecordId
      )
      return getCourseTopicRecord({ id })
    }
    return courseTopicRecord
  }

  private transform(
    dbTopicRecord: Table<Tap.Course.TopicRecord>
  ): WithTimestamps<Tap.Course.TopicRecord> {
    return toCamel(dbTopicRecord)
  }
}
