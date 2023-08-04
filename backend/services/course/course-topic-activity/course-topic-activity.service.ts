import { Knex } from 'knex'
import { snake, toCamel } from 'snake-camel'
import { Tap } from '../../../../lib'
import { FieldsQueryResult } from '../../../middleware/fields'
import { WithTimestamps } from '../../db'
import knex from '../../db/conn.knex'
import { Table } from '../../db/tables'

export class CourseTopicActivityService {
  db: Knex

  constructor(db: Knex = knex) {
    this.db = db
  }

  async getCourseTopicActivities({
    courseTopicActivityIds = [],
    courseTopicIds = [],
    fields = ['*'] as FieldsQueryResult<Tap.Course.TopicActivity>,
    getCourseTopicActivities = (
      courseTopicActivityIds: string[],
      courseTopicIds: string[]
    ): Promise<Table<Tap.Course.TopicActivity>[]> =>
      knex('course_topic_activity')
        .where((builder) => {
          if (courseTopicIds.length) {
            builder.whereIn('course_topic_id', courseTopicIds)
          }
          if (courseTopicActivityIds.length) {
            builder.orWhereIn('id', courseTopicActivityIds)
          }
        })
        .select(...fields.map(snake))
        .orderBy('order', 'asc'),
  } = {}): Promise<WithTimestamps<Tap.Course.TopicActivity>[]> {
    return await getCourseTopicActivities(
      courseTopicActivityIds,
      courseTopicIds
    ).then((activities) => activities.map(this.transform))
  }

  async getCourseTopicActivity(
    courseTopicActivityId: string,
    {
      fields = ['*'] as FieldsQueryResult<Tap.Course.TopicActivity>,
      getCourseTopicActivity = (
        courseTopicActivityId: string
      ): Promise<Table<Tap.Course.TopicActivity>> =>
        knex('course_topic_activity')
          .where({ id: courseTopicActivityId })
          .select(...fields.map(snake))
          .first(),
    } = {}
  ): Promise<WithTimestamps<Tap.Course.TopicActivity>> {
    return await getCourseTopicActivity(courseTopicActivityId).then(
      (activity) => {
        if (activity) {
          return this.transform(activity)
        }
      }
    )
  }

  private transform(
    dbActivity: Table<Tap.Course.TopicActivity>
  ): WithTimestamps<Tap.Course.TopicActivity> {
    return toCamel(dbActivity)
  }
}
