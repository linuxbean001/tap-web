import { Catch, Get } from 'next-api-decorators'
import { Tap } from '../../../../lib/domain'
import { AuthGuard, AuthUser } from '../../../middleware'
import {
  DateRangeQuery,
  type DateRangeQueryResult,
} from '../../../middleware/fields'
import { exceptionHandler } from '../../../utils/errors'
import AdminCompletedActivitiesService from './admin-completed-activities.service'

@Catch(exceptionHandler)
export default class CompletedActivitiesController {
  adminCompletedActivities: AdminCompletedActivitiesService

  constructor(completedActivities = new AdminCompletedActivitiesService()) {
    this.adminCompletedActivities = completedActivities
  }

  @Get('/')
  @AuthGuard()
  public async getCompletedActivities(
    @AuthUser() user: Tap.User,
    @DateRangeQuery()
    daterange: DateRangeQueryResult
  ) {
    try {
      const orgId: string = user.organization.id
      const adminCompletedActivities =
        await this.adminCompletedActivities.getCompletedActivities(
          orgId,
          daterange
        )
      if (!adminCompletedActivities) {
        throw new Error('No skills found')
      }
      return adminCompletedActivities
    } catch (err) {
      throw new Error(`Error in Admin Completed Activities, ${err}`)
    }
  }
}
