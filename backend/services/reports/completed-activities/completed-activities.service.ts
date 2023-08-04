import { Knex } from 'knex'
import { Tap } from '../../../../lib'
import { type DateRangeQueryResult } from '../../../middleware/fields'
import { getDaysBetweenDates } from '../../../utils'
import knex from '../../db/conn.knex'

type CompletedActivityQueryRecord = {
  id: string
  completed_at: string
}

export default class CompletedActivitiesService {
  db: Knex

  constructor(db?: Knex) {
    this.db = db || knex
  }

  async getCompletedActivities(
    userId: string,
    daterange: DateRangeQueryResult
  ): Promise<Tap.Report.CompletedActivities> {
    const start = daterange.start
    const end = daterange.end
    const dates = CompletedActivitiesService.generateDateMap(start, end)
    start && start.setUTCHours(0, 0, 0, 0)
    end && end.setUTCHours(23, 59, 59, 999)
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
    const resp = await this.db.raw(QUERY, [userId, start, end])

    if (resp.rows.length) {
      const rows = resp.rows.map((row: CompletedActivityQueryRecord) => {
        row.completed_at = new Date(row.completed_at).toISOString()
        return row
      })

      rows.forEach((row: CompletedActivityQueryRecord) => {
        const date = String(row.completed_at).substring(0, 10)
        if (date in dates) {
          dates[date].count += 1
        }
      })
    }

    return Object.keys(dates).map((date) => ({
      date,
      ...dates[date],
    }))
  }

  static generateDateMap(
    startDate: Date,
    endDate: Date
  ): { [date: string]: { count: number } } {
    if (startDate && endDate) {
      const days = getDaysBetweenDates(startDate, endDate)
      return new Array(days).fill(null).reduce((dates, _, index) => {
        const dt = new Date(endDate.getTime() - index * 24 * 60 * 60 * 1000)
          .toISOString()
          .substring(0, 10)
        dates[dt] = {
          count: 0,
        }
        return dates
      }, {})
    } else {
      return {}
    }
  }
}
