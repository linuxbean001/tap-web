import { Knex } from 'knex'
import { Tap } from '../../../../lib'
import { type DateRangeQueryResult } from '../../../middleware/fields'
import { listToMap } from '../../../utils'
import knex from '../../db/conn.knex'
import UserService from '../../user/user.service'
import CompletedActivitiesService from './completed-activities.service'

type CompletedActivityQueryRecord = {
  user_id: string
  id: string
  completed_at: string
}

export default class AdminCompletedActivitiesService {
  db: Knex
  userService: UserService

  constructor(db?: Knex, userService?: UserService) {
    this.db = db || knex
    this.userService = userService || new UserService(db)
  }

  async getCompletedActivities(
    orgId: string,
    daterange: DateRangeQueryResult
  ): Promise<Tap.Report.CompletedActivities> {
    const users: Tap.User[] = await this.userService.getUsersInOrg(orgId)
    const membersIndex = listToMap(
      users.filter((user) => user.role === Tap.User.Role.Member),
      'id'
    )

    const start = daterange?.start
    const end = daterange?.end
    start && start.setUTCHours(0, 0, 0, 0)
    end && end.setUTCHours(23, 59, 59, 999)
    const dates = CompletedActivitiesService.generateDateMap(start, end)

    let QUERY = `
      SELECT DISTINCT cr.user_id, ctar.id, ctar.completed_at
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

    const resp = await this.db.raw(QUERY, [orgId, start, end])
    if (resp.rows.length) {
      const rows = resp.rows
        .map((row: CompletedActivityQueryRecord) => {
          row.completed_at = new Date(row.completed_at).toISOString()
          return row
        })
        .filter(
          (row: CompletedActivityQueryRecord) => row.user_id in membersIndex
        )

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
}
