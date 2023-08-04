import { createHandler } from 'next-api-decorators'

import AdminProgressSummaryController from '../../../../../backend/services/reports/admin-progress-summary/admin_reporting.controller'

export default createHandler(AdminProgressSummaryController)
