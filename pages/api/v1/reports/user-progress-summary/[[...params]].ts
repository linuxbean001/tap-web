import { createHandler } from 'next-api-decorators'

import UserReportingController from '../../../../../backend/services/reports/user-progress-summary/user_reporting.controller'

export default createHandler(UserReportingController)
