import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('course_topic_activity', function (table) {
    table.enu('type', [
      'Quiz',
      'Knowledge_Check',
      'Activity_Check',
      'Simulation_Assessment',
      'Simulation_Training',
    ])
  })
}

export async function down(knex: Knex): Promise<void> {
  const hasColumn = await knex.schema.hasColumn('course_topic_activity', 'type')
  if (hasColumn) {
    await knex.schema.alterTable('course_topic_activity', function (table) {
      table.dropColumn('type')
    })
  }
}
