import { Catch, Get, Param } from 'next-api-decorators'
import { Tap } from '../../../../lib/domain'
import { AuthGuard, AuthUser } from '../../../middleware'
import {
  DateRangeQuery,
  type DateRangeQueryResult,
} from '../../../middleware/fields'
import { exceptionHandler } from '../../../utils/errors'
import { AdminSkillDistributionService } from './admin_skill_distribution.service'
@Catch(exceptionHandler)
export default class AdminSkillDistributionController {
  adminSkillDistribution: AdminSkillDistributionService

  constructor(adminSkillDistribution = new AdminSkillDistributionService()) {
    this.adminSkillDistribution = adminSkillDistribution
  }

  @Get('/courses/:courseIds')
  @AuthGuard()
  public async getAdminSkillDistribution(
    @AuthUser() user: Tap.User,
    @Param('courseIds') courseIds: string,
    @DateRangeQuery()
    daterange: DateRangeQueryResult
  ) {
    const orgId: string = user.organization.id
    const selectedCourses: string[] = courseIds.split(',')
    if (!selectedCourses.length) {
      return []
    }
    return await this.adminSkillDistribution.getSkillDistribution(
      orgId,
      selectedCourses,
      daterange
    )
  }
}
