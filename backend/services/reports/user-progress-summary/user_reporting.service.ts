import { Knex } from 'knex'
import { Tap } from '../../../../lib'
import { type DateRangeQueryResult } from '../../../middleware/fields'
import knex from '../../db/conn.knex'

export class UserReportingService {
  db: Knex

  constructor(db: Knex = knex) {
    this.db = db
  }

  async getUserMetrics(
    userId: string,
    daterange: DateRangeQueryResult,
    {
      getAverageScore = (userId: string, startDate: Date, endDate: Date) =>
        knex
          .select(knex.raw('AVG(score) as average_score'))
          .from(function () {
            this.select('score')
              .from('quiz_record')
              .where({ user_id: userId })
              .whereBetween('created_at', [startDate, endDate])
              .unionAll(function () {
                this.select('score')
                  .from('knowledge_check_record')
                  .where({ user_id: userId })
                  .whereBetween('created_at', [startDate, endDate])
              })
              .unionAll(function () {
                this.select('score')
                  .from('simulation_assessment_record')
                  .where({ user_id: userId })
                  .whereBetween('created_at', [startDate, endDate])
              })
              .as('combined_scores')
          })
          .limit(1),
    } = {},
    {
      getAveragePreSkillGrowth = (
        userId: string,
        startDate: Date,
        endDate: Date
      ) =>
        knex.raw(
          `SELECT AVG(qr_pre.score) AS pre_average_score
          FROM quiz_record AS qr_pre
          JOIN quiz AS q_pre ON q_pre.id = qr_pre.quiz_id
          WHERE q_pre.assessment_type = 'Pre-Assessment'
          AND qr_pre.user_id = :userId
          AND qr_pre.created_at BETWEEN :startDate AND :endDate`,
          {
            userId: userId,
            startDate: startDate,
            endDate: endDate,
          }
        ),
    } = {},
    {
      getAveragePostSkillGrowth = (
        userId: string,
        startDate: Date,
        endDate: Date
      ) =>
        knex.raw(
          `SELECT AVG(qr_post.score) AS post_average_score
          FROM quiz_record AS qr_post
          JOIN quiz AS q_post ON q_post.id = qr_post.quiz_id
          WHERE q_post.assessment_type = 'Post-Assessment'
          AND qr_post.user_id = :userId
          AND qr_post.created_at BETWEEN :startDate AND :endDate`,
          {
            userId: userId,
            startDate: startDate,
            endDate: endDate,
          }
        ),
    } = {}
  ): Promise<Tap.Report.UserProgressSummary> {
    try {
      const startDate = daterange.start
      const endDate = daterange.end
      startDate.setUTCHours(0, 0, 0, 0)
      endDate.setUTCHours(23, 59, 59, 999)
      const accumulatedPointsQuery = `
        SELECT *
        FROM user_metrics
        WHERE user_id = ?
          AND type = 'user_point_total'
          AND created_at BETWEEN ? AND ?
        ORDER BY created_at DESC
      LIMIT 1;
      `
      const mostRecentRecordQuery = `
        SELECT *
        FROM user_metrics
        WHERE user_id = ?
          AND type = 'user_point_total'
          AND created_at < ?
        ORDER BY created_at DESC
        LIMIT 1;
      `
      const mostRecentRecord = await this.db.raw(mostRecentRecordQuery, [
        userId,
        startDate,
      ])

      const accumulatedPoints = await this.db.raw(accumulatedPointsQuery, [
        userId,
        startDate,
        endDate,
      ])
      const startPoints = mostRecentRecord[0]?.value || 0
      const endPoints = accumulatedPoints[0]?.value || 0
      const pointsEarnedRecords = Number(endPoints) - Number(startPoints)
      const averageScoreQueryResult = await getAverageScore(
        userId,
        startDate,
        endDate
      )
      const avgPreSkillGrowth = await getAveragePreSkillGrowth(
        userId,
        startDate,
        endDate
      )
      const averagePostSkillGrowth = await getAveragePostSkillGrowth(
        userId,
        startDate,
        endDate
      )
      let QUERY = `
        SELECT DISTINCT ctar.id, ctar.completed_at
        FROM course_record cr
            INNER JOIN course_topic_record ctr
                ON cr.id = ctr.course_record_id
            INNER JOIN course_topic_activity_record ctar
                ON ctr.id = ctar.course_topic_record_id
            INNER JOIN organization_to_course otc
                ON cr.course_id = otc.course_id
        WHERE ctar.completed_at IS NOT NULL AND cr.user_id = ?
              AND ctar.completed_at BETWEEN ? AND ?
    `
      const resp = await this.db.raw(QUERY, [userId, startDate, endDate])
      const topicCount = resp.rows.length
      const averageSkillGrowth =
        Number(averagePostSkillGrowth?.rows[0]?.post_average_score) -
          Number(avgPreSkillGrowth?.rows[0]?.pre_average_score) || 0
      return {
        pointsEarned: Number(pointsEarnedRecords),
        topicsCompleted: Number(topicCount),
        averageScore: Number(averageScoreQueryResult[0]?.average_score || 0),
        averageSkillGrowth: Number(averageSkillGrowth),
      }
    } catch (error) {
      return Promise.reject(`Error in GetUserMetrics:  ${error}`)
    }
  }
}
