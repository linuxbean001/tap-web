import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  try {
    await knex.schema.table('course_record', function (table) {
      table.string('organization_id')
    })
  } catch (error) {
    console.error(
      'Error adding organization_id column to course_record table:',
      error
    )
    throw error
  }
}

export async function down(knex: Knex): Promise<void> {
  try {
    await knex.schema.table('course_record', function (table) {
      table.dropColumn('organization_id')
    })
  } catch (error) {
    console.error(
      'Error dropping organization_id column from course_record table:',
      error
    )
    throw error
  }
}
