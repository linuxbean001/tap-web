import { Knex } from 'knex'

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('course_topic_activity').del()

  const courseTopics = await knex('course_topic').first()
  await knex('course_topic_activity').insert([
    {
      course_topic_id: courseTopics.id,
      path: 'curriculum/tests/testing_course/test0/v1/index_lms.html',
      description: `Pre-assessment that submits a 50% quiz score, returning 50 points.`,
      id: 'crs-top-act-1',
      au_id:
        'https://tap3d.com/tap-content/curriculum/tests/testing_course/test0/v1',
      order: 0,
      title: `Test Pre-Assessment Activity`,
      type: 'Quiz',
      is_vr_only: false,
    },
    {
      course_topic_id: courseTopics.id,
      path: 'curriculum/tests/testing_course/test1/v1/index_lms.html',
      description: `Automatically moves through slides. No score submitted.`,
      id: 'crs-top-act-2',
      au_id:
        'https://tap3d.com/tap-content/curriculum/tests/testing_course/test1/v1',
      order: 1,
      title: `Test Activity_Check Activity`,
      type: 'Activity_Check',
      is_vr_only: false,
    },
    {
      course_topic_id: courseTopics.id,
      path: 'curriculum/tests/testing_course/test2/v1/index_lms.html',
      description: `Submits one quiz question.`,
      id: 'crs-top-act-3',
      au_id:
        'https://tap3d.com/tap-content/curriculum/tests/testing_course/test2/v1',
      order: 2,
      title: `Test Knowledge_Check Activity`,
      type: 'Knowledge_Check',
      is_vr_only: false,
    },
    {
      course_topic_id: courseTopics.id,
      path: 'curriculum/tests/testing_course/test3/v1/index_lms.html',
      description: `Stand-in for a Simulation_Training. Returns 50 points.`,
      id: 'crs-top-act-4',
      au_id:
        'https://tap3d.com/tap-content/curriculum/tests/testing_course/test3/v1',
      order: 3,
      title: `Test Simulation_Training Activity`,
      type: 'Simulation_Training',
      is_vr_only: false,
    },
    {
      course_topic_id: courseTopics.id,
      path: 'curriculum/tests/testing_course/test4/v1/index_lms.html',
      description: `Stand-in for Simulation_Assessment. Returns 100 points.`,
      id: 'crs-top-act-5',
      au_id:
        'https://tap3d.com/tap-content/curriculum/tests/testing_course/test4/v1',
      order: 4,
      title: `Test Simulation_Assessment Activity`,
      type: 'Simulation_Assessment',
      is_vr_only: false,
    },
    {
      course_topic_id: courseTopics.id,
      path: 'curriculum/tests/testing_course/test5/v1/index_lms.html',
      description: `Post-assessment that submits a 100% quiz score, returning 100 points.`,
      id: 'crs-top-act-6',
      au_id:
        'https://tap3d.com/tap-content/curriculum/tests/testing_course/test5/v1',
      order: 5,
      title: `Test Post-Assessment Activity`,
      type: 'Quiz',
      is_vr_only: false,
    },
  ])

  // Inserts seed entries
  // await Promise.all(
  //   courseTopics.map((topic) =>
  //     knex('course_topic_activity').insert([
  // {
  //   course_topic_id: topic.id,
  //   path: 'top',
  //   description: `A simple description of a sub-topic of ${topic.title}`,
  //   id: Id.CourseTopicActivity(),
  //   au_id: 'https://tap3d.com/courses/1',
  //   order: 0,
  //   title: `Sub-topic: ${topic.title}`,
  //   type: 'Activity_Check',
  //   isVROnly: false,
  // },
  //     ])
  //   )
  // )
}
