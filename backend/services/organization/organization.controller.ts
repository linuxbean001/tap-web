import { Get, Param } from 'next-api-decorators'
import { Tap } from '../../../lib'
import { AuthGuard, AuthUser } from '../../middleware'
import type { FieldsQueryResult } from '../../middleware/fields'
import { AllowedFields, FieldsQuery } from '../../middleware/fields'
import OrganizationService from './organization.service'

export default class OrganizationController {
  organizationService: OrganizationService

  constructor(organizationService = new OrganizationService()) {
    this.organizationService = organizationService
  }

  @Get('/')
  @AuthGuard()
  public async getOrganizations() {
    return this.organizationService.getOrganizations()
  }

  @Get('/:organizationId')
  @AuthGuard()
  public async getOrganization(
    @Param('organizationId') organizationId: string,
    @AuthUser() user: Tap.User
  ) {
    const orgId: string = user?.organization?.id
    return this.organizationService.getOrganization(orgId || organizationId)
  }

  @Get('/:organizationId/groups')
  @AuthGuard()
  async getOrganizationGroups(
    @AuthUser() user: Tap.User,
    @Param('organizationId') organizationId: string,
    @FieldsQuery(AllowedFields.UserGroup)
    fields: FieldsQueryResult<Tap.User.Group>
  ) {
    const orgId: string = user?.organization?.id
    return this.organizationService.getOrganizationGroups(
      orgId || organizationId,
      {
        fields,
      }
    )
  }
}
