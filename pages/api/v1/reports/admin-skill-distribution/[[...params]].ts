import { createHandler } from 'next-api-decorators'

import AdminSkillDistributionController from '../../../../../backend/services/reports/admin-skill-distribution/admin_skill_distribution.controller'

export default createHandler(AdminSkillDistributionController)
