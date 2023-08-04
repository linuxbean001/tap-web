import { Knex } from 'knex'
import { toSnake } from 'snake-camel'
import { Tap } from '../../../../lib'
import Id from '../../../utils/id.utils'
import knex from '../../db/conn.knex'
import { NewTable } from '../../db/tables'

export class CourseQuizQuestionService {
  db: Knex

  constructor(db: Knex = knex) {
    this.db = db
  }

  /**
   * @function createCourseQuiz
   * @param courseTopicActivityId
   * @returns {Promise<Partial<Tap.Course.Quiz>>}
   * @description
   * this function inserts a new quiz record into the quiz table if no record exists for the user
   */
  // async getOrCreateCourseQuiz(
  //   courseTopicActivityId: string
  // ): Promise<Partial<Tap.Course.Quiz>> {
  //   try {
  //     // check if a quiz record already exists for this user
  //     const courseTopicId = await this.getCourseTopicId(courseTopicActivityId)
  //     const { course_id } = await this.db('course_topic')
  //       .where('id', courseTopicId)
  //       .first()
  //       .select('course_id')
  //     const existingQuiz = await this.db('quiz')
  //       .where('course_id', course_id)
  //       .andWhere('course_topic_id', courseTopicId)
  //       .andWhere('course_topic_activity_id', courseTopicActivityId)
  //       .first()

  //     // if a quiz record doesn't exist, create a new one
  //     let newQuizId: string
  //     if (!existingQuiz) {
  //       newQuizId = Id.Quiz()
  //       const { title } = await this.db('course_topic')
  //         .where('id', courseTopicId)
  //         .first()
  //       const courseQuizRecord: NewTable<Tap.Course.Quiz> = toSnake({
  //         id: newQuizId,
  //         courseId: course_id,
  //         courseTopicActivityId,
  //         courseTopicId,
  //         assessmentType:
  //           title === 'Pre-Assessment' ? 'Pre-Assessment' : 'Post-Assessment',
  //       })
  //       await this.db.insert(courseQuizRecord, ['id']).into('quiz')
  //     } else {
  //       newQuizId = existingQuiz.id
  //     }
  //     return { id: newQuizId }
  //   } catch (error) {
  //     return Promise.reject(error)
  //   }
  // }

  /**
   * Create a new course quiz question.
   * @function createCourseQuestion
   * @param activityTopicId
   * @param type
   * @param quizId
   * @returns
   *
   * Situations to handle:
   * - Question record does not exist
   *    - Insert a new course question record
   *    - Query for quiz record
   *      - If quiz record does not exist, create a new quiz record
   *      - Do nothing if quiz record exists
   */
  async createCourseQuestion(
    activityTopicId: string,
    type: string,
    quizId: string
  ): Promise<Partial<Tap.Course.Question>> {
    try {
      // check to see if the question already exists, if it does, return early
      const topicId = await this.getCourseTopicId(activityTopicId)
      const existingQuestion = await this.db('question').where({
        quiz_id: quizId,
        topic_id: topicId,
      })

      if (existingQuestion && existingQuestion.length > 0)
        return {
          id: existingQuestion[0].id,
        }

      const courseQuizQuestion: NewTable<Tap.Course.Question> = toSnake({
        id: Id.Question(),
        quizId: quizId,
        topicId,
        type,
      })
      const courseRecordIds = await this.db
        .insert(courseQuizQuestion, ['id'])
        .into('question')
      if (courseRecordIds.length === 0) {
        throw new Error('Failed to insert course record.')
      }
      return {
        id: courseQuizQuestion.id,
      }
    } catch (error) {
      return Promise.reject(error)
    }
  }

  /**
   * @function createCourseAnswers
   * @param questionId
   * @param userId
   * @param wasCorrect
   * @param timeSpent
   * @param pointValue
   * @returns
   *
   * this function inserts a new answer record into the answer table
   */
  async createCourseAnswer(
    questionId: string,
    userId: string,
    wasCorrect: boolean,
    timeSpent: string,
    pointValue: number
  ): Promise<void> {
    try {
      const answerId = Id.Answer()
      const courseQuizAnswer: NewTable<Tap.Course.Answer> = toSnake({
        id: answerId,
        questionId,
        userId,
        wasCorrect,
        timeSpent,
        pointValue,
      })
      await this.db.insert(courseQuizAnswer, ['id']).into('answer')
    } catch (error) {
      return Promise.reject(error)
    }
  }

  /**
   * @function addUserQuizScore
   * @param userId
   * @param courseTopicActivityRecordId
   * @param score
   * @param timeSpent
   * @returns Promise<void>
   */
  async addUserQuizScore(
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
      const quizId = await this.getQuizId(courseTopicActivityId)
      const userQuizRecord: NewTable<Partial<Tap.Course.QuizRecord>> = toSnake({
        id: Id.QuizRecord(),
        userId,
        timeSpent,
        quizId,
        courseRecordId: result.course_record_id,
        courseTopicRecordId: result.course_topic_record_id,
        courseTopicActivityRecordId,
        score,
      })
      await trx
        .insert(userQuizRecord, ['id'])
        .into('quiz_record')
        .catch((err) => {
          trx.rollback()
          return Promise.reject(`Could not insert into quiz record: ${err}`)
        })
      await trx.commit()
    } catch (error) {
      await trx.rollback()
      return Promise.reject(error)
    }
  }

  /**
   * @function getQuizId
   * @param courseTopicActivityId
   * @returns
   */
  async getQuizId(courseTopicActivityId: string): Promise<string> {
    try {
      const quiz = await this.db('quiz').where(
        'course_topic_activity_id',
        courseTopicActivityId
      )
      return quiz.length === 0 ? '' : quiz[0].id
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
        `can not get course topic id in quiz service: ${error}`
      )
    }
  }
}
