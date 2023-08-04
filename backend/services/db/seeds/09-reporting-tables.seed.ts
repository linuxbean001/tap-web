import { Knex } from 'knex'
import { Id } from '../../../utils/id.utils'

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('activity_check').del()
  await knex('knowledge_check').del()
  await knex('quiz').del()
  await knex('simulation_training').del()
  await knex('simulation_assessment').del()

  // for the test course,
  // insert quiz, knowledge check, activity check, simulation_training, and simulation_assessment entries

  const course = await knex('course').first()
  const courseTopic = await knex('course_topic').first()
  // Inserts seed entries
  await knex('quiz').insert([
    {
      id: Id.Quiz(),
      course_id: course.id,
      course_topic_activity_id: 'crs-top-act-1',
      course_topic_id: courseTopic.id,
      assessment_type: 'Pre-Assessment',
    },
    {
      id: Id.Quiz(),
      course_id: course.id,
      course_topic_activity_id: 'crs-top-act-6',
      course_topic_id: courseTopic.id,
      assessment_type: 'Post-Assessment',
    },
  ])

  await knex('activity_check').insert([
    {
      id: Id.ActivityCheck(),
      course_id: course.id,
      course_topic_id: courseTopic.id,
      course_topic_activity_id: 'crs-top-act-2',
    },
  ])

  await knex('knowledge_check').insert([
    {
      id: Id.KnowledgeCheck(),
      course_id: course.id,
      course_topic_id: courseTopic.id,
      course_topic_activity_id: 'crs-top-act-3',
    },
  ])

  await knex('simulation_training').insert([
    {
      id: Id.SimulationTraining(),
      course_id: course.id,
      course_topic_id: courseTopic.id,
      course_topic_activity_id: 'crs-top-act-4',
    },
  ])

  await knex('simulation_assessment').insert([
    {
      id: Id.SimulationAssessment(),
      course_id: course.id,
      course_topic_id: courseTopic.id,
      course_topic_activity_id: 'crs-top-act-5',
    },
  ])
}
