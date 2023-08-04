import { createHandler } from 'next-api-decorators'

import CourseController from '../../../../backend/services/course/course.controller'

export default createHandler(CourseController)
