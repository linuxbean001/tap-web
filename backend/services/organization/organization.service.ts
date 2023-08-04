import { snake, toCamel } from 'snake-camel'

import { Tap } from '../../../lib'
import { FieldsQueryResult } from '../../middleware/fields'
import type { WithTimestamps } from '../db'
import knex from '../db/conn.knex'
import { PropelAuth } from '../propel/propel.service'

export default class OrganizationService {
  async getOrganization(
    organizationId: string,
    {
      getOrganization = (id: string) =>
        PropelAuth()
          .fetchOrg(id)
          .then((organization) => ({
            id: organization.orgId,
            name: organization.name,
          })),
    } = {}
  ): Promise<Tap.User.Organization> {
    const organization = await getOrganization(organizationId)
    return toCamel(organization)
  }

  async getOrganizations({
    getOrganizations = () =>
      PropelAuth()
        .fetchOrgByQuery({})
        .then((res) => res.orgs),
  } = {}): Promise<Tap.User.Organization[]> {
    const organizations = await getOrganizations()
    return organizations
      .map((organization) => ({
        id: organization.orgId,
        name: organization.name,
      }))
      .map(toCamel)
  }

  async getOrganizationGroups(
    organizationId: string,
    {
      fields = ['*'] as FieldsQueryResult<Tap.User.Group>,
      getOrganizationGroups = (organizationId: string) =>
        knex('user_group')
          .where({ organization_id: organizationId })
          .select(...fields.map(snake)),
    } = {}
  ): Promise<WithTimestamps<Tap.User.Group>[]> {
    const groups = await getOrganizationGroups(organizationId)
    return groups.map(toCamel)
  }
}
