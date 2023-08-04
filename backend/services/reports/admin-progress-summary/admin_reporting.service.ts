import { Knex } from 'knex'
import { Tap } from '../../../../lib'
import { DateRangeQueryResult } from '../../../middleware/fields'
import knex from '../../db/conn.knex'

export class AdminReportingService {
  db: Knex

  constructor(db: Knex = knex) {
    this.db = db
  }

  async getAdminMetrics(
    organizationId: string,
    users: string[],
    daterange: DateRangeQueryResult,
    {
      getTotalLearningHours = (
        organizationId: string,
        startDate: Date,
        endDate: Date
      ) =>
        knex('admin_metrics')
          .where({
            organization_id: organizationId,
            type: 'total_learning_hours',
          })
          .whereBetween('created_at', [startDate, endDate])
          .orderBy('created_at', 'desc')
          .first(),
    } = {},
    {
      getLastTotalLearningHours = (organizationId: string, startDate: Date) =>
        knex('admin_metrics')
          .where({
            organization_id: organizationId,
            type: 'total_learning_hours',
          })
          .where('created_at', '<', startDate)
          .orderBy('created_at', 'desc')
          .first(),
    } = {},
    {
      getAssessedUserCount = (
        organizationId: string,
        startDate: Date,
        endDate: Date
      ) =>
        knex('admin_metrics')
          .where({
            organization_id: organizationId,
            type: 'assessed_user_count',
          })
          .whereBetween('created_at', [startDate, endDate])
          .orderBy('created_at', 'desc')
          .first(),
    } = {},
    {
      getLastAssessedUserCount = (organizationId: string, startDate: Date) =>
        knex('admin_metrics')
          .where({
            organization_id: organizationId,
            type: 'assessed_user_count',
          })
          .where('created_at', '<', startDate)
          .orderBy('created_at', 'desc')
          .first(),
    } = {},
    {
      getUserAveragePreScore = (id: string, startDate: Date, endDate: Date) =>
        knex
          .select(knex.raw('AVG(qr_pre.score) AS pre_average_score'))
          .from('quiz_record AS qr_pre')
          .join('quiz AS q_pre', 'q_pre.id', 'qr_pre.quiz_id')
          .where('q_pre.assessment_type', 'Pre-Assessment')
          .where('qr_pre.user_id', id)
          .whereRaw('qr_pre.created_at BETWEEN ? AND ?', [startDate, endDate])
          .first(),
    } = {},
    {
      getUserAveragePostScore = (id: string, startDate: Date, endDate: Date) =>
        knex
          .select(knex.raw('AVG(qr_post.score) AS post_average_score'))
          .from('quiz_record AS qr_post')
          .join('quiz AS q_post', 'q_post.id', 'qr_post.quiz_id')
          .where('q_post.assessment_type', 'Post-Assessment')
          .where('qr_post.user_id', id)
          .whereRaw('qr_post.created_at BETWEEN ? AND ?', [startDate, endDate])
          .first(),
    } = {}
  ): Promise<Tap.Report.AdminProgressSummary> {
    try {
      const startDate = daterange.start
      const endDate = daterange.end
      startDate.setUTCHours(0, 0, 0, 0)
      endDate.setUTCHours(23, 59, 59, 999)
      const learningHoursRecords = await getTotalLearningHours(
        organizationId,
        startDate,
        endDate
      )
      const lastLearningHourRecords = await getLastTotalLearningHours(
        organizationId,
        startDate
      )
      const learningHours =
        Number(learningHoursRecords?.value || 0) -
        Number(lastLearningHourRecords?.value || 0)
      const assessedUserCountRecords = await getAssessedUserCount(
        organizationId,
        startDate,
        endDate
      )
      const lastAssessedUserCount = await getLastAssessedUserCount(
        organizationId,
        startDate
      )
      const assessedUserCount =
        Number(assessedUserCountRecords?.value || 0) -
        Number(lastAssessedUserCount?.value || 0)

      const preassessmentUserScores = await Promise.all(
        users.map(async (id) => {
          const preassessment = await getUserAveragePreScore(
            id,
            startDate,
            endDate
          )
          return Number(preassessment.pre_average_score) || 0
        })
      )

      const postassessmentUserScores = await Promise.all(
        users.map(async (id) => {
          const postassessment = await getUserAveragePostScore(
            id,
            startDate,
            endDate
          )
          return Number(postassessment.post_average_score) || 0
        })
      )
      const preassessmentSum = preassessmentUserScores.reduce(
        (accumulator, currentValue) => accumulator + currentValue
      )
      const preassessmentMean = Math.round(
        preassessmentSum / preassessmentUserScores.length
      ).toFixed(2)

      const postassessmentSum = postassessmentUserScores.reduce(
        (accumulator, currentValue) => accumulator + currentValue
      )
      const postassessmentMean = Math.round(
        postassessmentSum / postassessmentUserScores.length
      ).toFixed(2)

      const orgAverageSkillGrowthDifference =
        Number(postassessmentMean) - Number(preassessmentMean)

      let QUERY = `
        SELECT DISTINCT cr.user_id
        FROM course_record cr
            INNER JOIN course_topic_record ctr
                ON cr.id = ctr.course_record_id
            INNER JOIN course_topic_activity_record ctar
                ON ctr.id = ctar.course_topic_record_id
            INNER JOIN organization_to_course otc
                ON cr.course_id = otc.course_id
        WHERE ctar.completed_at IS NOT NULL AND otc.third_party_id = ?
        AND ctar.completed_at BETWEEN ? AND ?
      `
      const resp = await this.db.raw(QUERY, [
        organizationId,
        startDate,
        endDate,
      ])
      const activeUsers = resp?.rows?.length

      return {
        activeUsers: Number(activeUsers) ?? 0,
        learningHours: Number(learningHours) ?? 0,
        assessedUsers: Number(assessedUserCount) ?? 0,
        averageSkillGrowth: Number(orgAverageSkillGrowthDifference),
      }
    } catch (error) {
      return Promise.reject(`Error in Admin Reporting Service:  ${error}`)
    }
  }
}
