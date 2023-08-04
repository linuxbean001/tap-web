import { Catch, Get, Param } from 'next-api-decorators'
import { AuthGuard } from '../../../middleware'
import { DateRangeQuery } from '../../../middleware/fields'
import type { DateRangeQueryResult } from '../../../middleware/fields/daterange-query'
import { exceptionHandler } from '../../../utils/errors'
import { UserReportingService } from './user_reporting.service'
@Catch(exceptionHandler)
export default class UserReportingController {
  userReport: UserReportingService

  constructor(userReport = new UserReportingService()) {
    this.userReport = userReport
  }

  @Get('/:userId')
  @AuthGuard()
  public async getUserMetrics(
    @Param('userId') userId: string,
    @DateRangeQuery()
    daterange: DateRangeQueryResult
  ) {
    const userMetrics = await this.userReport.getUserMetrics(userId, daterange)
    return userMetrics
  }
}
