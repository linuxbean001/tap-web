import { Knex } from 'knex'
import { Tap } from '../../../../lib'
import { DateRangeQueryResult } from '../../../middleware/fields'
import { listToMap } from '../../../utils'
import knex from '../../db/conn.knex'
import UserService from '../../user/user.service'

/**
 * @description
 * This service is responsible for retrieving the user skill distribution
 * for a given user. This level is calculated by taking the most recent
 * post assessment for a course.
 */

export class AdminSkillDistributionService {
  db: Knex

  constructor(db: Knex = knex) {
    this.db = db
  }

  getProficiencyLevel(score: number): string {
    switch (true) {
      case score <= 69:
        return 'Needs Practice'
      case score >= 70 && score <= 79:
        return 'Novice'
      case score >= 80 && score <= 89:
        return 'Proficient'
      case score >= 90:
        return 'Expert'
      default:
        return 'Needs Practice'
    }
  }

  async getSkillDistribution(
    orgId: string,
    courseIds: string[],
    daterange: DateRangeQueryResult
  ): Promise<Tap.Report.SkillDistribution> {
    const users: Tap.User[] = await new UserService().getUsersInOrg(orgId)
    const membersIndex = listToMap(
      users.filter((user) => user.role === Tap.User.Role.Member),
      'id'
    )
    const courses = await this.db('course').whereIn('id', courseIds)
    const coursesMap = listToMap(courses, 'id')

    let QUERY = `
      SELECT cr.user_id, cr.course_id, qr.score
      FROM course_record cr
          INNER JOIN (
              SELECT user_id, course_id, max(created_at) AS created_at
              FROM course_record
              GROUP BY user_id, course_id
              ) AS latest_cr
              ON cr.created_at = latest_cr.created_at AND cr.course_id = latest_cr.course_id
          INNER JOIN quiz_record qr
              ON cr.id = qr.course_record_id      
      WHERE cr.course_id IN (${courseIds.map((_) => '?').join(',')})            
    `
    const bindings = [...courseIds]

    if (Object.keys(daterange).length > 0) {
      QUERY += ` AND cr.created_at BETWEEN ? AND ?`
      bindings.push((daterange.start || new Date()).toISOString())
      bindings.push((daterange.end || new Date()).toISOString())
    }

    const resp = await this.db.raw(QUERY, bindings)

    if (resp.rows.length) {
      const assessedUserIds = resp.rows.map((res) => res.user_id)
      const members = users.filter((user) => user.role === 0)
      const nonAssessedUsers = members
        .map((user) => user.id)
        .filter((elem) => !assessedUserIds.includes(elem))
      const userCourseScores: {
        user_id: string
        course_id: string
        score: number
      }[] = resp.rows

      const courseAggregates = userCourseScores.reduce((agg, rec) => {
        const level = this.getProficiencyLevel(rec.score)
        if (!agg[rec.course_id]) {
          agg[rec.course_id] = {
            Unassessed: 0,
            'Needs Practice': 0,
            Novice: 0,
            Proficient: 0,
            Expert: 0,
          }
        }
        agg[rec.course_id][level]++

        nonAssessedUsers.forEach((id) => {
          agg[rec.course_id]['Unassessed']++
        })

        return agg
      }, {})

      return Object.keys(courseAggregates).map((courseId) => ({
        topicId: courseId,
        topicTitle: coursesMap[courseId].title,
        metrics: Object.keys(courseAggregates[courseId]).map(
          (level: Tap.Report.Level) => ({
            count: courseAggregates[courseId][level] || 0,
            level,
          })
        ),
      }))
    }

    return []
  }
}
