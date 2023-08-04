import { Catch, Get, Param } from 'next-api-decorators'

import { AuthGuard } from '../../../middleware'
import {
  DateRangeQuery,
  type DateRangeQueryResult,
} from '../../../middleware/fields'
import { exceptionHandler } from '../../../utils/errors'
import { UserSkillDistributionService } from './user_skill_distribution.service'
@Catch(exceptionHandler)
export default class UserSkillDistributionController {
  userSkillDistribution: UserSkillDistributionService

  constructor(userSkillDistribution = new UserSkillDistributionService()) {
    this.userSkillDistribution = userSkillDistribution
  }

  @Get('/:userId')
  @AuthGuard()
  public async getSkillDistribution(
    @Param('userId') userId: string,
    @DateRangeQuery()
    daterange: DateRangeQueryResult
  ) {
    const skills = await this.userSkillDistribution.getSkillDistribution(
      userId,
      daterange
    )
    if (!skills) {
      throw new Error('No skills found')
    }
    return skills
  }
}
