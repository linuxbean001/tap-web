import { Catch, Get, Param } from 'next-api-decorators'
import { AuthGuard } from '../../../middleware'
import {
  DateRangeQuery,
  type DateRangeQueryResult,
} from '../../../middleware/fields'
import { exceptionHandler } from '../../../utils/errors'
import CompletedActivitiesService from './completed-activities.service'

@Catch(exceptionHandler)
export default class CompletedActivitiesController {
  completedActivities: CompletedActivitiesService

  constructor(completedActivities = new CompletedActivitiesService()) {
    this.completedActivities = completedActivities
  }

  @Get('/:userId')
  @AuthGuard()
  public async getCompletedActivities(
    @Param('userId') userId: string,
    @DateRangeQuery()
    daterange: DateRangeQueryResult
  ) {
    const completedActivities =
      await this.completedActivities.getCompletedActivities(userId, daterange)
    return completedActivities
  }
}
