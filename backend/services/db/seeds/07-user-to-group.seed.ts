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
  await knex('user_to_group').del()

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
  const groups = await knex('user_group')

  // Inserts seed entries
  for (const user of users) {
    for (const group of groups) {
      await knex('user_to_group').insert([
        {
          user_group_id: group.id,
          user_id: user.id,
        },
      ])
    }
  }
}
