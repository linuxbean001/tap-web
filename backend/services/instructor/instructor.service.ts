import { Knex } from 'knex'
import { snake, toCamel } from 'snake-camel'
import { Tap } from '../../../lib'
import {
  FieldsQueryResult,
  ReferencesQueryResult,
} from '../../middleware/fields'
import { WithTimestamps } from '../db'
import knex from '../db/conn.knex'
import { Table } from '../db/tables'

export class InstructorService {
  db: Knex

  constructor(db: Knex = knex) {
    this.db = db
  }

  async getCourseInstructors(
    courseId: string,
    {
      fields = ['*'] as FieldsQueryResult<Tap.Instructor>,
      references = {
        avatar: true,
      } as ReferencesQueryResult<Tap.Instructor>,
      getCourseInstructors = (
        courseId: string
      ): Promise<Table<Tap.Instructor>[]> =>
        this.db
          .from('instructor')
          .innerJoin(
            'course_to_instructor',
            'instructor.id',
            'course_to_instructor.instructor_id'
          )
          .where({
            course_id: courseId,
          })
          .select(...fields.map(snake)),
      getAvatar = (id: string): Promise<WithTimestamps<Tap.Asset>> =>
        knex('asset')
          .where({ id: id })
          .select(...fields.map(snake))
          .first(),
    } = {}
  ): Promise<WithTimestamps<Tap.Instructor>[]> {
    const dbInstructors = await getCourseInstructors(courseId)
    const instructors = dbInstructors.map(this.transform)
    if (references.avatar) {
      return await Promise.all(
        instructors.map(async (ins) => {
          if (ins) {
            ins.avatar = await getAvatar(ins.avatarId)
          }
          return ins
        })
      )
    }
  }

  transform(
    dbInstructors: Table<Tap.Instructor>
  ): WithTimestamps<Tap.Instructor> {
    return toCamel(dbInstructors)
  }
}
