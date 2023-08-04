import { Knex } from 'knex'
import { Id } from '../../../utils/id.utils'

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('course_category').del()

  // Inserts seed entries
  await knex('course_category').insert(
    [
      { label: 'Onboarding' },
      { label: 'Electrical' },
      { label: 'Pneumatics' },
      { label: 'Vacuum' },
      { label: 'Occupations' },
      { label: 'Workmanship' },
    ].map((category) => ({ ...category, id: Id.CourseCategory() }))
  )
}
