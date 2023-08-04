import { Knex } from 'knex'
import { toSnake } from 'snake-camel'
import { Tap } from '../../../../lib'
import Id from '../../../utils/id.utils'
import knex from '../../db/conn.knex'
import { NewTable } from '../../db/tables'

export class CourseActivityCheckService {
  db: Knex

  constructor(db: Knex = knex) {
    this.db = db
  }

  /**
   * Create a new course activity check question.
   * @function createCourseACQuestion
   * @param activityTopicId
   * @param type
   * @param acId
   * @returns
   *
   */
  async createCourseACQuestion(
    activityTopicId: string,
    type: string,
    acId: string
  ): Promise<Partial<Tap.Course.ActivityCheckQuestion>> {
    try {
      // check to see if the activity check question already exists, if it does, return early
      const topicId = await this.getCourseTopicId(activityTopicId)
      const existingACQuestion = await this.db('activity_check_question').where(
        {
          ac_id: acId,
          topic_id: topicId,
        }
      )

      if (existingACQuestion && existingACQuestion.length > 0)
        return {
          id: existingACQuestion[0].id,
        }

      const courseACQuestion: NewTable<Tap.Course.ActivityCheckQuestion> =
        toSnake({
          id: Id.ActivityCheckQuestion(),
          acId: acId,
          topicId,
          type,
        })
      const courseACQRecordIds = await this.db
        .insert(courseACQuestion, ['id'])
        .into('activity_check_question')
      if (courseACQRecordIds.length === 0) {
        throw new Error('Failed to insert course record.')
      }
      return {
        id: courseACQuestion.id,
      }
    } catch (error) {
      return Promise.reject(error)
    }
  }

  /**
   * @function createCourseACAnswers
   * @param acQuestionId
   * @param userId
   * @param wasCorrect
   * @param timeSpent
   * @param pointValue
   * @returns
   *
   * this function inserts a new activity check answer entry into the ac answers table
   */
  async createCourseAnswer(
    acQuestionId: string,
    userId: string,
    wasCorrect: boolean,
    timeSpent: string,
    pointValue: number
  ): Promise<void> {
    try {
      const ACId = Id.ActivityCheckAnswer()
      const courseACAnswer: NewTable<Tap.Course.ActivityCheckAnswer> = toSnake({
        id: ACId,
        acQuestionId,
        userId,
        wasCorrect,
        timeSpent,
        pointValue,
      })
      await this.db.insert(courseACAnswer, ['id']).into('activity_check_answer')
    } catch (error) {
      return Promise.reject(error)
    }
  }

  /**
   * @function addUserACScore
   * @param userId
   * @param courseTopicActivityRecordId
   * @param score
   * @param timeSpent
   * @returns Promise<void>
   */
  async addUserACScore(
    userId: string,
    courseTopicActivityRecordId: string,
    score: number,
    timeSpent: string,
    courseTopicActivityId: string
  ): Promise<void> {
    const trx = await this.db.transaction()
    try {
      const query = trx('course_topic_activity_record')
        .join(
          'course_topic_record',
          'course_topic_activity_record.course_topic_record_id',
          'course_topic_record.id'
        )
        .join(
          'course_record',
          'course_topic_record.course_record_id',
          'course_record.id'
        )
        .select(
          'course_record.id as course_record_id',
          'course_topic_record.id as course_topic_record_id'
        )
        .where('course_topic_activity_record.id', courseTopicActivityRecordId)
        .where('course_record.user_id', userId)
        .first()

      const result = await query
      const acId = await this.getACQuizId(courseTopicActivityId)
      const userACRecord: NewTable<Partial<Tap.Course.ActivityCheckRecord>> =
        toSnake({
          id: Id.KnowledgeCheckRecord(),
          userId,
          timeSpent,
          acId,
          courseRecordId: result.course_record_id,
          courseTopicRecordId: result.course_topic_record_id,
          courseTopicActivityRecordId,
          score,
        })
      await trx
        .insert(userACRecord, ['id'])
        .into('activity_check_record')
        .catch((err) => {
          trx.rollback()
          return Promise.reject(
            `Could not insert into knowledge check record: ${err}`
          )
        })
      await trx.commit()
    } catch (error) {
      await trx.rollback()
      return Promise.reject(error)
    }
  }

  /**
   * @function getACQuizId
   * @param courseTopicActivityId
   * @returns Promise<string>
   */
  async getACQuizId(courseTopicActivityId: string): Promise<string> {
    try {
      const AC = await this.db('activity_check').where(
        'course_topic_activity_id',
        courseTopicActivityId
      )
      return AC?.length === 0 ? '' : AC[0].id
    } catch (error) {
      return Promise.reject(error)
    }
  }
  /**
   * @function getCourseTopicId
   * @param activityTopicId
   * @returns Promise<string>
   */
  async getCourseTopicId(activityTopicId: string): Promise<string> {
    try {
      const courseTopicId = await this.db('course_topic_activity').where({
        id: activityTopicId,
      })
      return courseTopicId.length === 0 ? '' : courseTopicId[0].course_topic_id
    } catch (error) {
      return Promise.reject(
        `Can not get course topic in activity service: ${error}`
      )
    }
  }
}
