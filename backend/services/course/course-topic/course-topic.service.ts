import { Knex } from 'knex'
import { snake, toCamel } from 'snake-camel'
import { Tap } from '../../../../lib'
import {
  FieldsQueryResult,
  ReferencesQueryResult,
} from '../../../middleware/fields'
import { WithTimestamps } from '../../db'
import knex from '../../db/conn.knex'
import { Table } from '../../db/tables'
import { CourseTopicActivityService } from '../course-topic-activity/course-topic-activity.service'

export class CourseTopicService {
  db: Knex

  constructor(db: Knex = knex) {
    this.db = db
  }

  async getCourseTopics({
    courseTopicIds = [],
    courseIds = [],
    fields = ['*'] as FieldsQueryResult<Tap.Course.Topic>,
    references = {
      activities: true,
    } as ReferencesQueryResult<Tap.Course.Topic>,
    getCourseTopics = (
      courseIds: string[]
    ): Promise<Table<Tap.Course.Topic>[]> =>
      knex('course_topic')
        .where((builder) => {
          if (courseIds.length) {
            builder.whereIn('course_id', courseIds)
          }
          if (courseTopicIds.length) {
            builder.orWhereIn('id', courseTopicIds)
          }
        })
        .select(...fields.map(snake))
        .orderBy('order', 'asc'),
    getCourseTopicActivities = (courseTopicIds: string[]) =>
      new CourseTopicActivityService(this.db).getCourseTopicActivities({
        courseTopicIds,
      }),
  } = {}): Promise<WithTimestamps<Tap.Course.Topic>[]> {
    const courseTopics = await getCourseTopics(courseIds).then((topics) =>
      topics.map(this.transform)
    )

    if (references.activities) {
      const courseTopicIds = courseTopics.map((topic) => topic.id)
      const courseTopicActivities = await getCourseTopicActivities(
        courseTopicIds
      )
      courseTopics.forEach((topic) => {
        topic.activities = courseTopicActivities.filter(
          (activity) => activity.courseTopicId === topic.id
        )
      })
    }

    return courseTopics
  }

  async getCourseTopic(
    courseTopicId: string,
    {
      fields = ['*'] as FieldsQueryResult<Tap.Course.Topic>,
      references = {
        activities: true,
      } as ReferencesQueryResult<Tap.Course.Topic>,
      getCourseTopic = (
        courseTopicId: string
      ): Promise<Table<Tap.Course.Topic>> =>
        knex('course_topic')
          .where({ id: courseTopicId })
          .select(...fields.map(snake))
          .first(),
      getCourseTopicActivities = (courseTopicIds: string[]) =>
        new CourseTopicActivityService(this.db).getCourseTopicActivities({
          courseTopicIds,
        }),
    } = {}
  ): Promise<WithTimestamps<Tap.Course.Topic>> {
    const courseTopic = await getCourseTopic(courseTopicId).then((topic) => {
      if (topic) {
        return this.transform(topic)
      }
    })
    if (!courseTopic) {
      return null
    }
    if (references.activities) {
      courseTopic.activities = await getCourseTopicActivities([courseTopicId])
    }
    return courseTopic
  }

  private transform(
    dbTopic: Table<Tap.Course.Topic>
  ): WithTimestamps<Tap.Course.Topic> {
    return toCamel(dbTopic)
  }
}
