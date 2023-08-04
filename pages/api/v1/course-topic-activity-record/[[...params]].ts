import { createHandler } from 'next-api-decorators'

import { CourseTopicActivityRecordController } from '../../../../backend/services/course/course-topic-activity-record'

export default createHandler(CourseTopicActivityRecordController)
