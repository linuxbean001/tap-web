import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table('course_record', function (table) {
    table.index(['user_id', 'course_id'], 'idx_crs_rec__user_id_course_id')
  })
  await knex.schema.table('course_topic_record', function (table) {
    table.index('course_record_id', 'idx_crs_top_rec__course_record_id')
  })
  await knex.schema.table('course_topic_activity_record', function (table) {
    table.index(
      'course_topic_record_id',
      'idx_crs_top_act_rec__course_topic_record_id'
    )
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table('course_record', function (table) {
    table.dropIndex(['user_id', 'course_id'], 'idx_crs_rec__user_id_course_id')
  })
  await knex.schema.table('course_topic_record', function (table) {
    table.dropIndex('course_record_id', 'idx_crs_top_rec__course_record_id')
  })
  await knex.schema.table('course_topic_activity_record', function (table) {
    table.dropIndex(
      'course_topic_record_id',
      'idx_crs_top_act_rec__course_topic_record_id'
    )
  })
}
