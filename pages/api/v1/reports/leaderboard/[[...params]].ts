import { createHandler } from 'next-api-decorators'

import LeaderboardController from '../../../../../backend/services/reports/leaderboard/leaderboard.controller'

export default createHandler(LeaderboardController)
