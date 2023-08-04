import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table('organization_to_course', function (table) {
    table.index('third_party_id', 'idx_org_to_crs__third_party_id')
  })
  await knex.schema.table('course_topic', function (table) {
    table.index('course_id', 'idx_crs_top__course_id')
  })
  await knex.schema.table('course_topic_activity', function (table) {
    table.index('course_topic_id', 'idx_crs_top_act__course_topic_id')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table('organization_to_course', function (table) {
    table.dropIndex('third_party_id', 'idx_org_to_crs__third_party_id')
  })
  await knex.schema.table('course_topic', function (table) {
    table.dropIndex('course_id', 'idx_crs_top__course_id')
  })
  await knex.schema.table('course_topic_activity', function (table) {
    table.dropIndex('course_topic_id', 'idx_crs_top_act__course_topic_id')
  })
}
