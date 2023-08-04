import { Knex } from 'knex'
import { Tap } from '../../../../lib'
import { DateRangeQueryResult } from '../../../middleware/fields'
import knex from '../../db/conn.knex'

/**
 * @description
 * This service is responsible for retrieving the user skill distribution
 * for a given user. This level is calculated by taking the most recent
 * post assessment for a course.
 */
export class UserSkillDistributionService {
  db: Knex

  constructor(db: Knex = knex) {
    this.db = db
  }

  async getProficiencyLevel(score: number): Promise<string> {
    let proficiencyLevel: string = ''
    switch (true) {
      case score <= 69:
        proficiencyLevel = 'Needs Practice'
        break
      case score >= 70 && score <= 79:
        proficiencyLevel = 'Novice'
        break
      case score >= 80 && score <= 89:
        proficiencyLevel = 'Proficient'
        break
      case score >= 90:
        proficiencyLevel = 'Expert'
        break
      default:
        proficiencyLevel = 'Needs Practice'
        break
    }
    return proficiencyLevel
  }

  /**
   * getSkillDistribution
   *
   * Shows the skill level of a user per course
   * Get the course id
   * grab the most recent post assessment score for this user
   * for this course.
   *
   * Short Summary of the SQL Logic:
   * Given that a user can have multiple
   */
  async getSkillDistribution(
    userId: string,
    daterange: DateRangeQueryResult
  ): Promise<Tap.Report.UserSkillDistribution> {
    try {
      const skillDistribution = []
      const startDate = daterange.start
      const endDate = daterange.end
      const courseRecords = await knex
        .select(
          'course_record.id',
          'course_record.user_id',
          'course_record.course_id',
          'course_record.created_at',
          'course_record.updated_at'
        )
        .from(function () {
          this.select(
            'course_id',
            knex.raw('max(created_at) as latest_created_at')
          )
            .from('course_record')
            .where('user_id', userId)
            .groupBy('course_id')
            .as('latest_records')
        })
        .innerJoin('course_record', function () {
          this.on(
            'latest_records.course_id',
            '=',
            'course_record.course_id'
          ).andOn(
            'latest_records.latest_created_at',
            '=',
            'course_record.created_at'
          )
        })
        .whereBetween('course_record.created_at', [startDate, endDate])

      for (const record of courseRecords) {
        const quizRecord = await this.db('quiz_record')
          .where({
            user_id: userId,
            course_record_id: record.id,
          })
          .orderBy('created_at', 'desc')
        const courseTitle = await this.db('course')
          .where('id', record.course_id)
          .first()
        if (quizRecord.length > 0) {
          const skillLevel = await this.getProficiencyLevel(quizRecord[0].score)
          const userSkillObject = {
            topic: courseTitle.title,
            level: skillLevel,
          }
          skillDistribution.push(userSkillObject)
        } else {
          skillDistribution.push({
            topic: courseTitle.title,
            level: 'Needs Practice',
          })
        }
      }
      return skillDistribution as Tap.Report.UserSkillDistribution
    } catch (error) {
      return Promise.reject(`Error in getting skill distribution: ${error}`)
    }
  }
}
