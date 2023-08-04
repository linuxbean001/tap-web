import { createHandler } from 'next-api-decorators'

import CourseRecordController from '../../../../backend/services/course/course-record/course-record.controller'

export default createHandler(CourseRecordController)
