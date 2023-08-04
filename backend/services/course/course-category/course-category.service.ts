import { Knex } from 'knex'
import { snake, toCamel } from 'snake-camel'
import { Tap } from '../../../../lib'
import { FieldsQueryResult } from '../../../middleware/fields'
import { WithTimestamps } from '../../db'
import knex from '../../db/conn.knex'
import { Table } from '../../db/tables'

export class CourseCategoryService {
  db: Knex

  constructor(db: Knex = knex) {
    this.db = db
  }

  async getCourseCategories(
    courseIds: string[],
    {
      fields = ['*'] as FieldsQueryResult<Tap.Course.Category>,
      getCourseCategories = (
        courseIds: string[]
      ): Promise<Table<Tap.Course.Category>[]> =>
        this.db
          .select('course_category.*')
          .from('course')
          .innerJoin(
            'course_category',
            'course.category_id',
            'course_category.id'
          )
          .whereIn('course.id', courseIds),
    } = {}
  ): Promise<WithTimestamps<Tap.Course.Category>[]> {
    const dbCategories = await getCourseCategories(courseIds)
    return dbCategories.map(this.transform)
  }

  async getCourseCategory(
    courseCategoryId: string,
    {
      fields = ['*'] as FieldsQueryResult<Tap.Course.Category>,
      getCourseCategory = (): Promise<Table<Tap.Course.Category>> =>
        knex('course_category')
          .where({ id: courseCategoryId })
          .select(...fields.map(snake))
          .first(),
    } = {}
  ): Promise<WithTimestamps<Tap.Course.Category>> {
    const dbCourseCategory = await getCourseCategory()
    if (!dbCourseCategory) {
      return null
    }
    return this.transform(dbCourseCategory)
  }

  transform(
    dbCourseCategory: Table<Tap.Course.Category>
  ): WithTimestamps<Tap.Course.Category> {
    return toCamel(dbCourseCategory)
  }
}
