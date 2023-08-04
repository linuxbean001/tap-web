import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return (
    knex.schema

      /* ----------- ASSET ----------- */
      .createTable('asset', (table) => {
        // Columns
        table.string('id')

        table.string('type')
        table.string('url')
        table.timestamps(true, true)

        // Constraints
        table.primary(['id'])
      })

      /* ----------- COURSE CATEGORY ----------- */
      .createTable('course_category', (table) => {
        // Columns
        table.string('id')

        table.string('label')
        table.timestamps(true, true)

        // Constraints
        table.primary(['id'])
      })

      /* ----------- COURSE ----------- */
      .createTable('course', (table) => {
        // Columns
        table.string('id')

        table.integer('length_min')
        table.string('level')
        table.string('title')
        table.string('description')
        table.string('objectives')
        table.string('category_id')
        table.string('thumbnail_id')
        table.boolean('published')
        table.timestamps(true, true)

        // Constraints
        table.primary(['id'])
        table.foreign('category_id').references('id').inTable('course_category')
        table.foreign('thumbnail_id').references('id').inTable('asset')
      })

      /* ----------- COURSE RECORD ----------- */
      .createTable('course_record', (table) => {
        // Columns
        table.string('id')

        table.string('user_id')
        table.string('course_id')
        table.timestamps(true, true)

        // Constraints
        table.primary(['id'])
        table.foreign('course_id').references('id').inTable('course')
      })

      /* ----------- COURSE TOPIC ----------- */
      .createTable('course_topic', (table) => {
        // Columns
        table.string('id')

        table.string('title')
        table.string('description')
        table.integer('order')
        table.string('course_id')
        table.timestamps(true, true)

        // Constraints
        table.primary(['id'])
        table.foreign('course_id').references('id').inTable('course')
      })

      /* ----------- COURSE TOPIC RECORD ----------- */
      .createTable('course_topic_record', (table) => {
        // Columns
        table.string('id')

        table.string('course_topic_id')
        table.string('course_record_id')
        table.timestamps(true, true)

        // Constraints
        table.primary(['id'])
        table
          .foreign('course_topic_id')
          .references('id')
          .inTable('course_topic')
        table
          .foreign('course_record_id')
          .references('id')
          .inTable('course_record')
      })

      /* ----------- COURSE TOPIC ACTIVITY ----------- */
      .createTable('course_topic_activity', (table) => {
        // Columns
        table.string('id')
        table.string('au_id')
        table.string('path')
        table.integer('order')
        table.string('title')
        table.string('description')
        table.string('course_topic_id')
        table.timestamps(true, true)

        // Constraints
        table.primary(['id'])
        table
          .foreign('course_topic_id')
          .references('id')
          .inTable('course_topic')
      })

      /* ----------- COURSE TOPIC ACTIVITY RECORD ----------- */
      .createTable('course_topic_activity_record', (table) => {
        // Columns
        table.string('id')

        table.timestamp('completed_at')
        table.string('course_topic_activity_id')
        table.string('course_topic_record_id')
        table.string('launch_url', 765)
        table.timestamps(true, true)

        // Constraints
        table.primary(['id'])
        table
          .foreign('course_topic_activity_id')
          .references('id')
          .inTable('course_topic_activity')
        table
          .foreign('course_topic_record_id')
          .references('id')
          .inTable('course_topic_record')
      })

      /* ----------- INSTRUCTOR ----------- */
      .createTable('instructor', (table) => {
        // Columns
        table.string('id')

        table.string('first_name')
        table.string('last_name')
        table.string('title')
        table.string('description')
        table.string('avatar_id')
        table.timestamps(true, true)

        // Constraints
        table.primary(['id'])
        table.foreign('avatar_id').references('id').inTable('asset')
      })

      /* ----------- INSTRUCTOR ----------- */
      .createTable('course_to_instructor', (table) => {
        // Columns
        table.string('course_id')
        table.string('instructor_id')
        table.timestamps(true, true)

        // Constraints
        table.primary(['course_id', 'instructor_id'])
        table.foreign('course_id').references('id').inTable('course')
        table.foreign('instructor_id').references('id').inTable('instructor')
      })

      /* ----------- COURSE ASSETS ----------- */
      .createTable('course_assets', (table) => {
        // Columns
        table.string('course_id')
        table.string('asset_id')
        table.timestamps(true, true)

        // Constraints
        table.primary(['course_id', 'asset_id'])
        table.foreign('course_id').references('id').inTable('course')
        table.foreign('asset_id').references('id').inTable('asset')
      })

      /* ----------- USER GROUP ----------- */
      .createTable('user_group', (table) => {
        // Columns
        table.string('id')

        table.string('name')
        table.string('organization_id')
        table.timestamps(true, true)

        // Constraints
        table.primary(['id'])
      })

      /* ----------- USER TO GROUP ----------- */
      .createTable('user_to_group', (table) => {
        // Columns
        table.string('user_id')
        table.string('user_group_id')
        table.timestamps(true, true)

        // Constraints
        table.primary(['user_id', 'user_group_id'])
        table.foreign('user_group_id').references('id').inTable('user_group')
      })
  )
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('course_to_instructor')
  await knex.schema.dropTableIfExists('course_assets')
  await knex.schema.dropTableIfExists('course_topic_activity_record')
  await knex.schema.dropTableIfExists('course_topic_record')
  await knex.schema.dropTableIfExists('course_topic_activity')
  await knex.schema.dropTableIfExists('course_topic')
  await knex.schema.dropTableIfExists('course_record')
  await knex.schema.dropTableIfExists('course')
  await knex.schema.dropTableIfExists('course_category')
  await knex.schema.dropTableIfExists('instructor')
  await knex.schema.dropTableIfExists('user_to_group')
  await knex.schema.dropTableIfExists('user_group')
  await knex.schema.dropTableIfExists('asset')
}
