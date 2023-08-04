import { Knex } from 'knex'
import { Id } from '../../../utils/id.utils'
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
  await knex('course_record').del()

  const courses = await knex('course')
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
      await knex('course_record').insert([
        {
          course_id: course.id,
          id: Id.CourseRecord(),
          user_id: user.id,
          organization_id: user.organization.id,
        },
      ])
    }
  }
}
