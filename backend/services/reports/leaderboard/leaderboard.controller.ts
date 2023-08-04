import { Catch, Get } from 'next-api-decorators'
import { Tap } from '../../../../lib/domain'

import { AuthGuard, AuthUser } from '../../../middleware'
import { DateRangeQuery } from '../../../middleware/fields'
import type { DateRangeQueryResult } from '../../../middleware/fields/daterange-query'
import { exceptionHandler } from '../../../utils/errors'
import { LeaderboardService } from './leaderboard.service'
@Catch(exceptionHandler)
export default class LeaderboardController {
  leaderboard: LeaderboardService

  constructor(leaderboard = new LeaderboardService()) {
    this.leaderboard = leaderboard
  }

  @Get('/')
  @AuthGuard()
  public async getLeaderboard(
    @AuthUser() user: Tap.User,
    @DateRangeQuery()
    daterange: DateRangeQueryResult
  ) {
    const orgId: string = user.organization.id
    const leaderboard = await this.leaderboard.getLeaderboard(orgId, daterange)
    return leaderboard
  }
}
