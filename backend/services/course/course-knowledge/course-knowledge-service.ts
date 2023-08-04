import { Knex } from 'knex'
import { toSnake } from 'snake-camel'
import { Tap } from '../../../../lib'
import Id from '../../../utils/id.utils'
import knex from '../../db/conn.knex'
import { NewTable } from '../../db/tables'

export class CourseKnowledgeCheckService {
  db: Knex

  constructor(db: Knex = knex) {
    this.db = db
  }

  /**
   * Create a new course knowledge check question.
   * @function createCourseKCQuestion
   * @param activityTopicId
   * @param type
   * @param kcId
   * @returns
   *
   */
  async createCourseKCQuestion(
    activityTopicId: string,
    type: string,
    kcId: string
  ): Promise<Partial<Tap.Course.KnowledgeCheckQuestion>> {
    try {
      // check to see if the knowledge check question already exists, if it does, return early
      const topicId = await this.getCourseTopicId(activityTopicId)
      const existingKCQuestion = await this.db(
        'knowledge_check_question'
      ).where({
        kc_id: kcId,
        topic_id: topicId,
      })

      if (existingKCQuestion && existingKCQuestion.length > 0)
        return {
          id: existingKCQuestion[0].id,
        }

      const courseKCQuestion: NewTable<Tap.Course.KnowledgeCheckQuestion> =
        toSnake({
          id: Id.Question(),
          kcId: kcId,
          topicId,
          type,
        })
      const courseKCQRecordIds = await this.db
        .insert(courseKCQuestion, ['id'])
        .into('knowledge_check_question')
      if (courseKCQRecordIds.length === 0) {
        throw new Error('Failed to insert course record.')
      }
      return {
        id: courseKCQuestion.id,
      }
    } catch (error) {
      return Promise.reject(error)
    }
  }

  /**
   * @function createCourseKCAnswers
   * @param kcQuestionId
   * @param userId
   * @param wasCorrect
   * @param timeSpent
   * @param pointValue
   * @returns
   *
   * this function inserts a new answer record into the answer table
   */
  async createCourseKCAnswers(
    kcQuestionId: string,
    userId: string,
    wasCorrect: boolean,
    timeSpent: string,
    pointValue: number
  ): Promise<void> {
    try {
      const answerId = Id.Answer()
      const courseKCAnswer: NewTable<Tap.Course.KnowledgeCheckAnswer> = toSnake(
        {
          id: answerId,
          kcQuestionId,
          userId,
          wasCorrect,
          timeSpent,
          pointValue,
        }
      )
      await this.db
        .insert(courseKCAnswer, ['id'])
        .into('knowledge_check_answer')
    } catch (error) {
      return Promise.reject(error)
    }
  }

  /**
   * @function addUserKCScore
   * @param userId
   * @param courseTopicActivityRecordId
   * @param score
   * @param timeSpent
   * @returns Promise<void>
   */
  async addUserKCScore(
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
      const kcId = await this.getKCQuizId(courseTopicActivityId)
      const userKCRecord: NewTable<Partial<Tap.Course.KnowledgeCheckRecord>> =
        toSnake({
          id: Id.KnowledgeCheckRecord(),
          userId,
          timeSpent,
          kcId,
          courseRecordId: result.course_record_id,
          courseTopicRecordId: result.course_topic_record_id,
          courseTopicActivityRecordId,
          score,
        })
      await trx
        .insert(userKCRecord, ['id'])
        .into('knowledge_check_record')
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
   * @function getKCQuizId
   * @param courseTopicActivityId
   * @returns Promise<string>
   */
  async getKCQuizId(courseTopicActivityId: string): Promise<string> {
    try {
      const KC = await this.db('knowledge_check').where(
        'course_topic_activity_id',
        courseTopicActivityId
      )
      return KC?.length === 0 ? '' : KC[0].id
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
        `can not get course topic id in knowledge service: ${error}`
      )
    }
  }
}
