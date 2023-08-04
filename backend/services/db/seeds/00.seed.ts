import { Knex } from 'knex'
import * as id from '../../../utils/id.utils'

export async function seed(knex: Knex): Promise<void> {
  console.log(id.getId())
  // Deletes ALL existing entries
  await knex('course_to_instructor').del()
  await knex('course_assets').del()
  await knex('course_topic_activity_record').del()
  await knex('course_topic_record').del()
  await knex('course_topic_activity').del()
  await knex('course_topic').del()
  await knex('course_record').del()
  await knex('course').del()
  await knex('course_category').del()
  await knex('instructor').del()
  await knex('user_to_group').del()
  await knex('user_group').del()
  await knex('asset').del()
}
