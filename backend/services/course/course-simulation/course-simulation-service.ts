import { Knex } from 'knex'
import { toSnake } from 'snake-camel'
import { Tap } from '../../../../lib'
import Id from '../../../utils/id.utils'
import knex from '../../db/conn.knex'
import { NewTable } from '../../db/tables'

export class CourseSimulationService {
  db: Knex

  constructor(db: Knex = knex) {
    this.db = db
  }

  /**
   *
   */
  async addSimulationTrainingScore(
    userId: string,
    courseTopicActivityRecordId: string,
    courseTopicActivityId: string,
    timeStamp: string
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
      const simulationTrainingId = await this.getSimulationTrainingId(
        courseTopicActivityId
      )
      const userSimulationTrainingRecord: NewTable<
        Partial<Tap.Course.SimulationTrainingRecord>
      > = toSnake({
        id: Id.SimulationTrainingRecord(),
        userId,
        timeSpent: timeStamp,
        simulationTrainingId,
        courseRecordId: result.course_record_id,
        courseTopicRecordId: result.course_topic_record_id,
        courseTopicActivityRecordId,
        currentStep: '',
      })
      await trx
        .insert(userSimulationTrainingRecord, ['id'])
        .into('simulation_training_record')
        .catch((err) => {
          trx.rollback()
          return Promise.reject(
            `Could not insert into simulation training record: ${err}`
          )
        })
      await trx.commit()
    } catch (error) {
      await trx.rollback()
      return Promise.reject(error)
    }
  }

  /**
   * @function addSimulationAssessmentScore
   * @param userId
   * @param courseTopicActivityRecordId
   * @param score
   * @param timeStamp
   * @param courseTopicActivityId
   * @returns Promise<void>
   */
  async addSimulationAssessmentScore(
    userId: string,
    courseTopicActivityRecordId: string,
    score: number,
    timeStamp: string,
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
      const simulationAssessmentId = await this.getSimulationAssessmentId(
        courseTopicActivityId
      )
      const userSimulationAssessmentRecord: NewTable<
        Partial<Tap.Course.SimulationAssessmentRecord>
      > = toSnake({
        id: Id.SimulationAssessmentRecord(),
        userId,
        timeSpent: timeStamp,
        simulationAssessmentId,
        courseRecordId: result.course_record_id,
        courseTopicRecordId: result.course_topic_record_id,
        courseTopicActivityRecordId,
        score,
      })
      await trx
        .insert(userSimulationAssessmentRecord, ['id'])
        .into('simulation_assessment_record')
        .catch((err) => {
          trx.rollback()
          return Promise.reject(
            `Could not insert into simulation assessment record: ${err}`
          )
        })
      await trx.commit()
    } catch (error) {
      await trx.rollback()
      return Promise.reject(error)
    }
  }

  /**
   * @function getSimulationAssessmentId
   * @param courseTopicActivityId
   * @returns
   */
  async getSimulationAssessmentId(
    courseTopicActivityId: string
  ): Promise<string> {
    try {
      const simulationAssessmentRecord = await this.db(
        'simulation_assessment'
      ).where('course_topic_activity_id', courseTopicActivityId)
      return simulationAssessmentRecord?.length === 0
        ? ''
        : simulationAssessmentRecord[0].id
    } catch (error) {
      return Promise.reject(error)
    }
  }

  /**
   * @function getSimulationTrainingId
   * @param courseTopicActivityId
   * @returns
   */
  async getSimulationTrainingId(
    courseTopicActivityId: string
  ): Promise<string> {
    try {
      const simulationTrainingRecord = await this.db(
        'simulation_training'
      ).where('course_topic_activity_id', courseTopicActivityId)
      return simulationTrainingRecord?.length === 0
        ? ''
        : simulationTrainingRecord[0].id
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
        `can not get course topic id in simulation service: ${error}`
      )
    }
  }
}
