import { createHandler } from 'next-api-decorators'

import CompletedActivitiesController from '../../../../../backend/services/reports/completed-activities/completed-activities.controller'

export default createHandler(CompletedActivitiesController)
