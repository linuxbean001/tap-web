import { Knex } from 'knex'
import Id from '../../../utils/id.utils'
import OrganizationService from '../../organization/organization.service'
import * as mocks from './mocks'

export async function seed(
  knex: Knex,
  {
    shouldFakeAuthData = process.env.NEXT_PUBLIC_AUTH_URL?.includes('fake') ||
      process.env.ENV === 'local',
  } = {}
): Promise<void> {
  // Deletes ALL existing entries
  await knex('user_group').del()
  const organizations = await new OrganizationService().getOrganizations(
    shouldFakeAuthData
      ? {
          getOrganizations: async () => mocks.organizations,
        }
      : {}
  )
  // Inserts seed entries
  for (const organization of organizations) {
    await knex('user_group').insert([
      {
        id: Id.UserGroup(),
        name: `A1 Group: ${organization.name}`,
        organization_id: organization.id,
      },
      {
        id: Id.UserGroup(),
        name: `B2 Group: ${organization.name}`,
        organization_id: organization.id,
      },
    ])
  }
}
