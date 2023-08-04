import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('course_topic_activity', function (table) {
    table.boolean('is_vr_only').defaultTo(false)
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('course_topic_activity', function (table) {
    table.dropColumn('is_vr_only')
  })
}
