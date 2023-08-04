import { createHandler } from 'next-api-decorators'

import UserSkillDistributionController from '../../../../../backend/services/reports/user-skill-distribution/user_skill_distribution.controller'

export default createHandler(UserSkillDistributionController)
