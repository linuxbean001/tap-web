import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return (
    knex.schema
      /* ----------- ORGANIZATION TO COURSE ----------- */
      .createTable('organization_to_course', (table) => {
        // Columns
        table.string('id')
        table.string('organization_name')
        table.string('third_party_id')
        table.string('course_id')
        table.timestamps(true, true)

        // Constraints
        table.primary(['id'])
        table.foreign('course_id').references('id').inTable('course')
      })
  )
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('organization_to_course')
}
