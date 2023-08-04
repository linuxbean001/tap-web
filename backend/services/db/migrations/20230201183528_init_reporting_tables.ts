import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return (
    knex.schema

      /* ----------- Quiz ----------- */
      .createTable('quiz', (table) => {
        // Columns
        table.string('id')
        table.string('course_id')
        table.string('course_topic_id')
        table.string('course_topic_activity_id')
        table.string('assessment_type')
        table.timestamps(true, true)

        // Constraints
        table.primary(['id'])
        table.foreign('course_id').references('id').inTable('course')
        table
          .foreign('course_topic_id')
          .references('id')
          .inTable('course_topic')
        table
          .foreign('course_topic_activity_id')
          .references('id')
          .inTable('course_topic_activity')
      })
      /* ----------- Quiz Record ----------- */
      .createTable('quiz_record', (table) => {
        // Columns
        table.string('id')
        table.string('user_id')
        table.string('quiz_id')
        table.string('course_record_id')
        table.string('course_topic_record_id')
        table.string('course_topic_activity_record_id')
        table.integer('score')
        table.string('time_spent')
        table.timestamps(true, true)

        // Constraints
        table.primary(['id'])
        table.foreign('quiz_id').references('id').inTable('quiz')
        table
          .foreign('course_record_id')
          .references('id')
          .inTable('course_record')
        table
          .foreign('course_topic_record_id')
          .references('id')
          .inTable('course_topic_record')
        table
          .foreign('course_topic_activity_record_id')
          .references('id')
          .inTable('course_topic_activity_record')
      })

      /* ----------- QUESTIONS ----------- */
      .createTable('question', (table) => {
        // Columns
        table.string('id')
        table.string('quiz_id')
        table.string('topic_id')
        table.string('type')
        table.timestamps(true, true)

        // Constraints
        table.primary(['id'])
        table.foreign('topic_id').references('id').inTable('course_topic')
        table.foreign('quiz_id').references('id').inTable('quiz')
      })

      /* ----------- Answers ----------- */
      .createTable('answer', (table) => {
        // Columns
        table.string('id')
        table.string('user_id')
        table.string('question_id')
        table.boolean('was_correct')
        table.string('point_value')
        table.string('time_spent')
        table.timestamps(true, true)

        // Constraints
        table.primary(['id'])
        table.foreign('question_id').references('id').inTable('question')
      })

      /* ----------- KNOWLEDGE_CHECK ----------- */
      .createTable('knowledge_check', (table) => {
        // Columns
        table.string('id')
        table.string('course_id')
        table.string('course_topic_id')
        table.string('course_topic_activity_id')
        table.timestamps(true, true)

        // Constraints
        table.primary(['id'])
        table.foreign('course_id').references('id').inTable('course')
        table
          .foreign('course_topic_id')
          .references('id')
          .inTable('course_topic')
        table
          .foreign('course_topic_activity_id')
          .references('id')
          .inTable('course_topic_activity')
      })

      /* ----------- KNOWLEDGE_CHECK_RECORD ----------- */
      .createTable('knowledge_check_record', (table) => {
        // Columns
        table.string('id')
        table.string('user_id')
        table.string('kc_id')
        table.string('course_record_id')
        table.string('course_topic_record_id')
        table.string('course_topic_activity_record_id')
        table.integer('score')
        table.string('time_spent')
        table.timestamps(true, true)

        // Constraints
        table.primary(['id'])
        table.foreign('kc_id').references('id').inTable('knowledge_check')
        table
          .foreign('course_record_id')
          .references('id')
          .inTable('course_record')
        table
          .foreign('course_topic_record_id')
          .references('id')
          .inTable('course_topic_record')
        table
          .foreign('course_topic_activity_record_id')
          .references('id')
          .inTable('course_topic_activity_record')
      })

      /* ----------- KNOWLEDGE_CHECK_QUESTIONS ----------- */
      .createTable('knowledge_check_question', (table) => {
        // Columns
        table.string('id')
        table.string('kc_id')
        table.string('type')
        table.string('topic_id')
        table.timestamps(true, true)

        // Constraints
        table.primary(['id'])
        table.foreign('topic_id').references('id').inTable('course_topic')
      })

      /* ----------- KNOWLEDGE_CHECK_ANSWERS ----------- */
      .createTable('knowledge_check_answer', (table) => {
        // Columns
        table.string('id')
        table.string('user_id')
        table.string('kc_question_id')
        table.boolean('was_correct')
        table.string('point_value')
        table.integer('time_spent')
        table.timestamps(true, true)

        // Constraints
        table.primary(['id'])
        table
          .foreign('kc_question_id')
          .references('id')
          .inTable('knowledge_check_question')
      })

      /* ----------- ACTIVITY_CHECK ----------- */
      .createTable('activity_check', (table) => {
        // Columns
        table.string('id')
        table.string('course_id')
        table.string('course_topic_id')
        table.string('course_topic_activity_id')
        table.timestamps(true, true)

        // Constraints
        table.primary(['id'])
        table.foreign('course_id').references('id').inTable('course')
        table
          .foreign('course_topic_id')
          .references('id')
          .inTable('course_topic')
        table
          .foreign('course_topic_activity_id')
          .references('id')
          .inTable('course_topic_activity')
      })

      /* ----------- ACTIVITY_CHECK_RECORD ----------- */
      .createTable('activity_check_record', (table) => {
        // Columns
        table.string('id')
        table.string('user_id')
        table.string('ac_id')
        table.string('course_record_id')
        table.string('course_topic_record_id')
        table.string('course_topic_activity_record_id')
        table.integer('score')
        table.string('time_spent')
        table.timestamps(true, true)

        // Constraints
        table.primary(['id'])
        table.foreign('ac_id').references('id').inTable('activity_check')
        table
          .foreign('course_record_id')
          .references('id')
          .inTable('course_record')
        table
          .foreign('course_topic_record_id')
          .references('id')
          .inTable('course_topic_record')
        table
          .foreign('course_topic_activity_record_id')
          .references('id')
          .inTable('course_topic_activity_record')
      })

      /* ----------- ACTIVITY_CHECK_QUESTIONS ----------- */
      .createTable('activity_check_question', (table) => {
        // Columns
        table.string('id')
        table.string('ac_id')
        table.string('type')
        table.string('topic_id')
        table.timestamps(true, true)

        // Constraints
        table.primary(['id'])
        table.foreign('topic_id').references('id').inTable('course_topic')
      })

      /* ----------- ACTIVITY_CHECK_ANSWERS ----------- */
      .createTable('activity_check_answer', (table) => {
        // Columns
        table.string('id')
        table.string('user_id')
        table.string('ac_question_id')
        table.boolean('was_correct')
        table.string('point_value')
        table.integer('time_spent')
        table.timestamps(true, true)

        // Constraints
        table.primary(['id'])
        table
          .foreign('ac_question_id')
          .references('id')
          .inTable('activity_check_question')
      })

      /* ----------- USER_METRICS ----------- */
      .createTable('user_metrics', (table) => {
        // Columns
        table.string('id')
        table.string('user_id')
        table.string('organization_id')
        table.string('type')
        table.string('value')
        table.timestamps(true, true)

        // Constraints
        table.primary(['id'])
      })

      /* ----------- ADMIN_METRICS ----------- */
      .createTable('admin_metrics', (table) => {
        // Columns
        table.string('id')
        table.string('organization_id')
        table.string('type')
        table.string('value')
        table.timestamps(true, true)

        // Constraints
        table.primary(['id'])
      })

      /* ----------- SIMULATION_ASSESSMENT ----------- */
      .createTable('simulation_assessment', (table) => {
        // Columns
        table.string('id')
        table.string('course_id')
        table.string('course_topic_id')
        table.string('course_topic_activity_id')
        table.timestamps(true, true)

        // Constraints
        table.primary(['id'])
        table.foreign('course_id').references('id').inTable('course')
        table
          .foreign('course_topic_id')
          .references('id')
          .inTable('course_topic')
        table
          .foreign('course_topic_activity_id')
          .references('id')
          .inTable('course_topic_activity')
      })

      /* ----------- SIMULATION_ASSESSMENT_RECORD ----------- */
      .createTable('simulation_assessment_record', (table) => {
        // Columns
        table.string('id')
        table.string('user_id')
        table.string('course_record_id')
        table.string('course_topic_record_id')
        table.string('course_topic_activity_record_id')
        table.string('simulation_assessment_id')
        table.integer('score')
        table.integer('time_spent')
        table.timestamps(true, true)

        // Constraints
        table.primary(['id'])
        table
          .foreign('simulation_assessment_id')
          .references('id')
          .inTable('simulation_assessment')
        table
          .foreign('course_record_id')
          .references('id')
          .inTable('course_record')
        table
          .foreign('course_topic_record_id')
          .references('id')
          .inTable('course_topic_record')
        table
          .foreign('course_topic_activity_record_id')
          .references('id')
          .inTable('course_topic_activity_record')
      })

      /* ----------- SIMULATION_TRAINING ----------- */
      .createTable('simulation_training', (table) => {
        // Columns
        table.string('id')
        table.string('course_id')
        table.string('course_topic_id')
        table.string('course_topic_activity_id')
        table.timestamps(true, true)

        // Constraints
        table.primary(['id'])
        table.foreign('course_id').references('id').inTable('course')
        table
          .foreign('course_topic_id')
          .references('id')
          .inTable('course_topic')
        table
          .foreign('course_topic_activity_id')
          .references('id')
          .inTable('course_topic_activity')
      })

      /* ----------- SIMULATION_TRAINING_RECORD ----------- */
      .createTable('simulation_training_record', (table) => {
        // Columns
        table.string('id')
        table.string('simulation_training_id')
        table.string('course_record_id')
        table.string('course_topic_record_id')
        table.string('course_topic_activity_record_id')
        table.string('user_id')
        table.integer('current_step')
        table.integer('time_spent')
        table.timestamps(true, true)

        // Constraints
        table.primary(['id'])
        table
          .foreign('simulation_training_id')
          .references('id')
          .inTable('simulation_training')
        table
          .foreign('course_record_id')
          .references('id')
          .inTable('course_record')
        table
          .foreign('course_topic_record_id')
          .references('id')
          .inTable('course_topic_record')
        table
          .foreign('course_topic_activity_record_id')
          .references('id')
          .inTable('course_topic_activity_record')
      })
  )
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('quiz')
  await knex.schema.dropTableIfExists('quiz_record')
  await knex.schema.dropTableIfExists('question')
  await knex.schema.dropTableIfExists('answer')
  await knex.schema.dropTableIfExists('user_metrics')
  await knex.schema.dropTableIfExists('admin_metrics')
  await knex.schema.dropTableIfExists('knowledge_check')
  await knex.schema.dropTableIfExists('knowledge_check_record')
  await knex.schema.dropTableIfExists('knowledge_check_question')
  await knex.schema.dropTableIfExists('knowledge_check_answer')
  await knex.schema.dropTableIfExists('activity_check')
  await knex.schema.dropTableIfExists('activity_check_record')
  await knex.schema.dropTableIfExists('activity_check_question')
  await knex.schema.dropTableIfExists('activity_check_answer')
  await knex.schema.dropTableIfExists('simulation_assessment')
  await knex.schema.dropTableIfExists('simulation_assessment_record')
  await knex.schema.dropTableIfExists('simulation_training')
  await knex.schema.dropTableIfExists('simulation_training_record')
}
