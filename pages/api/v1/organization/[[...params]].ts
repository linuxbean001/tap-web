import { createHandler } from 'next-api-decorators'

import OrganizationController from '../../../../backend/services/organization/organization.controller'

export default createHandler(OrganizationController)
