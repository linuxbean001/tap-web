import { createHandler } from 'next-api-decorators'

import AdminCompletedActivitiesController from '../../../../../backend/services/reports/completed-activities/admin-completed-activities.controller'

export default createHandler(AdminCompletedActivitiesController)
