import { Catch, Get, Param } from 'next-api-decorators'
import { AuthGuard } from '../../../middleware'
import {
  DateRangeQuery,
  type DateRangeQueryResult,
} from '../../../middleware/fields'
import { exceptionHandler } from '../../../utils/errors'
import UserService from '../../user/user.service'
import { AdminReportingService } from './admin_reporting.service'
@Catch(exceptionHandler)
export default class AdminReportingController {
  adminReport: AdminReportingService

  constructor(adminReport = new AdminReportingService()) {
    this.adminReport = adminReport
  }

  @Get('/:organizationId')
  @AuthGuard()
  public async getUserMetrics(
    @Param('organizationId') organizationId: string,
    @DateRangeQuery()
    daterange: DateRangeQueryResult
  ) {
    const userService = new UserService()
    const usersInOrg = await userService.getUsersInOrg(organizationId)
    const users = usersInOrg
      .filter((user) => user.role === 0)
      .map((user) => user.id)
    const adminMetrics = await this.adminReport.getAdminMetrics(
      organizationId,
      users,
      daterange
    )
    return adminMetrics
  }
}
