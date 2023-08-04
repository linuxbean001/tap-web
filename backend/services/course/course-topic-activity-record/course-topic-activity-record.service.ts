import { Knex } from 'knex'
import { snake, toCamel, toSnake } from 'snake-camel'
import { z } from 'zod'
import { Tap } from '../../../../lib'
import {
  FieldsQueryResult,
  ReferencesQueryResult,
} from '../../../middleware/fields'
import {
  EncodeURLSearchParams,
  getAppDomainUrl,
  listToMap,
} from '../../../utils'
import Id from '../../../utils/id.utils'
import { WithTimestamps, rawQuery } from '../../db'
import knex from '../../db/conn.knex'
import { NewTable, Table } from '../../db/tables'
import UserService from '../../user/user.service'
import xAPIService from '../../xapi/xapi.service'
import { CourseRecordService } from '../course-record/course-record.service'
import { CourseTopicActivityService } from '../course-topic-activity/course-topic-activity.service'
import { CourseTopicRecordService } from '../course-topic-record/course-topic-record.service'

export class CourseTopicActivityRecordService {
  db: Knex

  constructor(db: Knex = knex) {
    this.db = db
  }

  async getCourseTopicActivityRecord(
    {
      id,
      courseTopicActivityId,
      courseTopicRecordId,
    }:
      | {
          id: string
          courseTopicActivityId?: never
          courseTopicRecordId?: never
        }
      | {
          id?: never
          courseTopicActivityId: string
          courseTopicRecordId: string
        },
    {
      fields = ['*'] as FieldsQueryResult<Tap.Course.TopicActivityRecord>,
      references = {
        courseTopicActivity: true,
      } as ReferencesQueryResult<Tap.Course.TopicActivityRecord>,
      getCourseTopicActivityRecord = (): Promise<
        Table<Tap.Course.TopicActivityRecord>
      > =>
        knex('course_topic_activity_record')
          .where(
            id
              ? { id }
              : {
                  course_topic_activity_id: courseTopicActivityId,
                  course_topic_record_id: courseTopicRecordId,
                }
          )
          .select(...fields.map(snake))
          .first(),
      getCourseTopicActivity = (
        courseTopicActivityId: string
      ): Promise<WithTimestamps<Tap.Course.TopicActivity>> =>
        new CourseTopicActivityService(this.db).getCourseTopicActivity(
          courseTopicActivityId
        ),
    } = {}
  ): Promise<WithTimestamps<Tap.Course.TopicActivityRecord>> {
    const record = await getCourseTopicActivityRecord().then((record) => {
      if (record) {
        return this.transform(record)
      }
    })
    if (!record) return null

    if (references.courseTopicActivity) {
      record.courseTopicActivity = await getCourseTopicActivity(
        record.courseTopicActivityId
      )
    }
    return record
  }

  async getCourseTopicActivityRecords(
    courseTopicRecordIds: string[],
    {
      fields = ['*'] as FieldsQueryResult<Tap.Course.TopicActivityRecord>,
      references = {
        courseTopicActivity: true,
      } as ReferencesQueryResult<Tap.Course.TopicActivityRecord>,

      getCourseTopicActivityRecords = (
        courseTopicRecordIds: string[]
      ): Promise<Table<Tap.Course.TopicActivityRecord>[]> =>
        knex('course_topic_activity_record')
          .whereIn('course_topic_record_id', courseTopicRecordIds)
          .select(...fields.map(snake)),

      getCourseTopicActivities = (
        courseTopicActivityIds: string[]
      ): Promise<WithTimestamps<Tap.Course.TopicActivity>[]> =>
        new CourseTopicActivityService(this.db).getCourseTopicActivities({
          courseTopicActivityIds,
        }),
    } = {}
  ): Promise<WithTimestamps<Tap.Course.TopicActivityRecord>[]> {
    const records = await getCourseTopicActivityRecords(
      courseTopicRecordIds
    ).then((records) => records.map(this.transform))

    if (references.courseTopicActivity) {
      const courseTopicActivities = await getCourseTopicActivities(
        records.map((rec) => rec.courseTopicActivityId)
      )
      const courseTopicActivitiesMap = listToMap(courseTopicActivities, 'id')
      records.forEach((rec) => {
        rec.courseTopicActivity =
          courseTopicActivitiesMap[rec.courseTopicActivityId]
      })
    }
    return records
  }

  async getCourseTopicActivityRecordByCourseRecord(
    courseRecordId: string,
    courseTopicActivityId: string,
    {
      getCourseTopicActivityRecord = (
        db: Knex,
        q: string,
        params: string[]
      ): Promise<Table<Tap.Course.TopicActivityRecord>[]> =>
        rawQuery<Table<Tap.Course.TopicActivityRecord>>(db, q, params),
    } = {}
  ): Promise<WithTimestamps<Tap.Course.TopicActivityRecord> | undefined> {
    const q = `
      SELECT ctar.*
      FROM course_topic_activity_record ctar
        INNER JOIN course_topic_record ctr
          ON ctar.course_topic_record_id = ctr.id
        INNER JOIN course_record cr
          ON ctr.course_record_id = cr.id
      WHERE cr.id = ? AND ctar.course_topic_activity_id = ?
    `
    return await getCourseTopicActivityRecord(this.db, q, [
      courseRecordId,
      courseTopicActivityId,
    ]).then((records) => {
      if (records.length) {
        return this.transform(records[0])
      }
    })
  }

  async createCourseTopicActivityRecord(
    courseTopicActivityId: string,
    courseTopicRecordId: string,
    launchUrl: string
  ): Promise<Partial<Table<Tap.Course.TopicActivityRecord>>> {
    const courseTopicActivityRecord: NewTable<Tap.Course.TopicActivityRecord> =
      toSnake({
        id: Id.CourseTopicActivityRecord(),
        courseTopicActivityId,
        courseTopicRecordId,
        launchUrl,
        completedAt: null,
      })
    const courseTopicActivityRecordIds = await this.db
      .insert(courseTopicActivityRecord, ['id'])
      .into('course_topic_activity_record')
    if (courseTopicActivityRecordIds.length === 0) {
      throw new Error('Failed to insert course topic activity record.')
    }
    return {
      id: courseTopicActivityRecord.id,
    }
  }

  async updateCourseTopicActivityRecord(
    id: string,
    updates: { [attr: string]: string | boolean | number },
    {
      updateCourseTopicActivityRecord = (
        id: string,
        updates: { [attr: string]: string | boolean | number }
      ): Promise<Table<Tap.Course.TopicActivityRecord>[]> =>
        this.db
          .table('course_topic_activity_record')
          .where({ id: id })
          .update(updates, '*'),
    } = {}
  ): Promise<WithTimestamps<Tap.Course.TopicActivityRecord> | undefined> {
    const attrs: Partial<NewTable<Tap.Course.TopicActivityRecord>> =
      toSnake(updates)
    z.object({
      completed_at: z.string().datetime({ offset: true }).optional(),
      course_topic_activity_id: z.string().optional(),
      course_topic_record_id: z.string().optional(),
      launch_url: z.string().optional(),
      updated_at: z.string().datetime({ offset: true }),
    })
      .strict()
      .parse(attrs)
    return await updateCourseTopicActivityRecord(id, attrs).then((records) => {
      if (records.length) {
        return this.transform(records[0])
      }
    })
  }

  async launchCourseTopicActivity(
    userId: string,
    courseId: string,
    courseTopicActivityId: string,
    {
      getUser = (userId: string): Promise<Tap.User> =>
        new UserService(this.db).getUserById(userId),
      launchXApiActivity = async (
        user: Tap.User,
        courseId: string,
        courseTopicActivity: Tap.Course.TopicActivity,
        courseRecordId: string,
        courseTopicActivityRecordId: string,
        launchMode: 'Normal' | 'Browse' | 'Review' = 'Normal'
      ) => {
        // send xapi/cmi5 statements
        const xapi: xAPIService = xAPIService.init()
        await xapi.createState(
          user,
          courseTopicActivity.id,
          courseTopicActivity.auId,
          courseRecordId,
          `${courseRecordId}|${courseTopicActivityRecordId}`,
          launchMode,
          'Completed',
          `${getAppDomainUrl()}/courses/${courseId}?courseRecordId=${courseRecordId}`
        )
        await xapi.createAgentProfile(user)
        await xapi.sendLaunchedStatement(
          user,
          courseRecordId,
          courseTopicActivity.id
        )
      },
    } = {}
  ): Promise<Partial<WithTimestamps<Tap.Course.TopicActivityRecord>>> {
    // get/create course record
    const courseRecordService = new CourseRecordService(this.db)
    const courseRecord = await courseRecordService.getOrCreateCourseRecord({
      userId,
      courseId,
    })

    const courseTopicActivity = await new CourseTopicActivityService(
      this.db
    ).getCourseTopicActivity(courseTopicActivityId)

    // get/create course topic records
    const courseTopicRecordService = new CourseTopicRecordService(this.db)
    const courseTopicRecord: Tap.Course.TopicRecord =
      await courseTopicRecordService.getOrCreateCourseTopicRecord({
        courseRecordId: courseRecord.id,
        courseTopicId: courseTopicActivity.courseTopicId,
      })

    const user: Tap.User = await getUser(userId)
    const isAdmin = user.role === Tap.User.Role.Admin

    const launchUrl = this.getCourseTopicActivityLaunchUrl(
      user,
      courseRecord.id,
      courseTopicActivity
    )

    // get/create course topic activity record
    const courseTopicActivityRecord: Partial<
      WithTimestamps<Tap.Course.TopicActivityRecord>
    > = isAdmin
      ? { launchUrl }
      : await this.getOrCreateCourseTopicActivityRecord(
          {
            courseTopicActivityId: courseTopicActivity.id,
            courseTopicRecordId: courseTopicRecord.id,
            launchUrl,
          },
          {
            createCourseTopicActivityRecord: async (
              courseTopicActivityId: string,
              courseTopicRecordId: string,
              launchUrl: string
            ) => {
              return await this.createCourseTopicActivityRecord(
                courseTopicActivityId,
                courseTopicRecordId,
                launchUrl
              )
            },
          }
        )

    await launchXApiActivity(
      user,
      courseRecord.courseId,
      courseTopicActivity,
      courseRecord.id,
      courseTopicActivityRecord.id || '',
      isAdmin
        ? 'Browse'
        : courseTopicActivityRecord.completedAt
        ? 'Review'
        : 'Normal'
    )

    return courseTopicActivityRecord
  }

  getCourseTopicActivityLaunchUrl(
    user: Tap.User,
    courseRecordId: string,
    courseTopicActivity: Tap.Course.TopicActivity
  ) {
    const params = {
      endpoint: `${getAppDomainUrl()}/api/v1/xapi`,
      fetch: `${getAppDomainUrl()}/api/v1/xapi/auth?${new URLSearchParams({
        id: user.id,
      })}`,
      actor: JSON.stringify(xAPIService.getUserAgent(user)),
      registration: courseRecordId,
      activityId: xAPIService.getActivityIri(courseTopicActivity.id),
      env: process.env.ENV,
      simulationId: courseTopicActivity.auId,
    }
    const path = courseTopicActivity.path.replace(/^\/$/g, '')

    const launchURL: string = `${
      process.env.NEXT_PUBLIC_CDN_URL
    }/${path}?${EncodeURLSearchParams(params)}`

    return launchURL
  }

  async getOrCreateCourseTopicActivityRecord(
    {
      courseTopicActivityId,
      courseTopicRecordId,
      launchUrl,
    }: {
      courseTopicActivityId: string
      courseTopicRecordId: string
      launchUrl: string
    },
    {
      getCourseTopicActivityRecord = this.getCourseTopicActivityRecord.bind(
        this
      ),
      createCourseTopicActivityRecord = this.createCourseTopicActivityRecord.bind(
        this
      ),
    } = {}
  ): Promise<WithTimestamps<Tap.Course.TopicActivityRecord>> {
    const courseTopicActivityRecord = await getCourseTopicActivityRecord(
      {
        courseTopicActivityId,
        courseTopicRecordId,
      },
      {
        references: {
          courseTopicActivity: true,
        },
      }
    )
    if (!courseTopicActivityRecord) {
      const { id } = await createCourseTopicActivityRecord(
        courseTopicActivityId,
        courseTopicRecordId,
        launchUrl
      )
      return getCourseTopicActivityRecord({ id })
    }
    return courseTopicActivityRecord
  }

  transform(
    courseTopicActivityRecord: Table<Tap.Course.TopicActivityRecord>
  ): WithTimestamps<Tap.Course.TopicActivityRecord> {
    return toCamel(courseTopicActivityRecord)
  }
}
