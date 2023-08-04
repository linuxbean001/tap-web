import { Knex } from 'knex'
import { Tap } from '../../../../lib'
import { type DateRangeQueryResult } from '../../../middleware/fields'
import knex from '../../db/conn.knex'
import UserService from '../../user/user.service'

interface Metrics {
  user_id: string
  value: string
  type: string
}
export class LeaderboardService {
  db: Knex

  constructor(db: Knex = knex) {
    this.db = db
  }

  async getLeaderboard(
    orgId: string,
    daterange: DateRangeQueryResult
  ): Promise<Tap.Report.Leaderboard> {
    let users: Tap.User[] = []
    const startDate = daterange.start
    const endDate = daterange.end
    startDate.setUTCHours(0, 0, 0, 0)
    endDate.setUTCHours(23, 59, 59, 999)
    try {
      const leaderboardData: Metrics[] = await knex('user_metrics')
        .select('user_id', 'value', 'type')
        .whereIn('type', ['user_point_total'])
        .whereIn('created_at', function () {
          this.select(knex.raw('max(created_at)'))
            .from('user_metrics')
            .where('organization_id', orgId)
            .whereIn('type', ['user_point_total'])
            .groupBy('user_id')
        })
        .whereBetween('created_at', [startDate, endDate])
        .orderBy('value', 'desc')
        .limit(12)

      const leaderboardQuery = `
        SELECT user_id, value, type
        FROM user_metrics
        WHERE type IN ('user_point_total')
          AND created_at IN (
            SELECT MAX(created_at)
            FROM user_metrics
            WHERE organization_id = ?
              AND type IN ('user_point_total')
            GROUP BY user_id
          )
          AND created_at BETWEEN ? AND ?
        ORDER BY value DESC
        LIMIT 12;
      `
      const resp = await this.db.raw(leaderboardQuery, [
        orgId,
        startDate,
        endDate,
      ])
      console.log('resp?.rows: ', resp?.rows)
      const userService = new UserService()
      users = await userService.getUsersInOrg(orgId)

      const leaderboardLookup: Record<string, Metrics> = {}
      resp?.rows.forEach((record: Metrics) => {
        leaderboardLookup[record.user_id] = record
      })

      return users
        .filter((user) => user.role === 0)
        .map((user) => {
          const record = leaderboardLookup[user.id]
          const metric = {
            id: user?.id,
            points: 0,
            firstName: user?.firstName,
            lastName: user?.lastName,
          }
          if (record) {
            metric.points = parseFloat(record.value || '0')
          }
          return metric
        })
        .sort((a, b) => b.points - a.points)
        .slice(0, 12) as Tap.Report.Leaderboard
    } catch (e) {
      return Promise.reject(
        `Error in processing leaderboard data: ${e}. The following are the users: ${users}`
      )
    }
  }
}
