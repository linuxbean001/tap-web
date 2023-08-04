import { Knex } from 'knex'
import UserService from '../../user/user.service'
import * as mocks from './mocks'

export async function seed(
  knex: Knex,
  {
    shouldFakeAuthData = process.env.NEXT_PUBLIC_AUTH_URL?.includes('fake') ||
      process.env.ENV === 'local',
  } = {}
): Promise<void> {
  // Deletes ALL existing entries
  await knex('course_topic').del()

  const courses = await knex('course')
  const topic = await knex('course_topic')
    .insert({
      id: 'crs-top-1',
      title: 'Test Module',
      course_id: courses[0].id,
      order: 0,
      description:
        'Each activity automatically moves through slides and then exits.',
    })
    .returning('*')
  const users = await new UserService()
    .getUsers(
      shouldFakeAuthData
        ? {
            getUsers: async () => mocks.users as any[],
          }
        : {}
    )
    .then((users) =>
      users.filter((user) => user.email.includes('member@haldotech'))
    )

  // Inserts seed entries
  for (const user of users) {
    for (const course of courses) {
      const courseRecord = await knex('course_record')
        .select('*')
        .where({ user_id: user.id })
        .first()
      await knex('course_topic_record').insert([
        {
          id: 'crs-top-1',
          course_topic_id: topic[0].id,
          course_record_id: courseRecord.id,
        },
      ])
    }
  }
  // Inserts seed entries
  // await Promise.all(
  //   courses.map((course) =>
  //     knex('course_topic').insert([
  //       {
  //         course_id: course.id,
  //         description: `A simple description of a topic in ${course.title}`,
  //         id: Id.CourseTopic(),
  //         order: 0,
  //         title: `Topic: ${course.title}`,
  //       },
  //     ])
  //   )
  // )
}
