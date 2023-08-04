import { Body, Catch, HttpCode, Post } from 'next-api-decorators'
import { z } from 'zod'

import { AuthGuard, AuthUserId } from '../../../middleware'
import { Validate } from '../../../middleware/validate'
import { exceptionHandler } from '../../../utils/errors'
import { CourseTopicActivityRecordService } from './course-topic-activity-record.service'

const validators = {
  createCourseTopicActivityRecord: z.object({
    courseId: z.string(),
    courseTopicActivityId: z.string(),
  }),
}

@AuthGuard()
@Catch(exceptionHandler)
export class CourseTopicActivityRecordController {
  service: CourseTopicActivityRecordService

  constructor(
    courseTopicActivityRecordService = new CourseTopicActivityRecordService()
  ) {
    this.service = courseTopicActivityRecordService
  }

  @Post()
  @HttpCode(201)
  async getOrCreateCourseTopicActivityRecord(
    @AuthUserId() userId: string,
    @Body()
    @Validate(validators.createCourseTopicActivityRecord)
    {
      courseId,
      courseTopicActivityId,
    }: z.infer<typeof validators.createCourseTopicActivityRecord>
  ) {
    try {
      return await this.service.launchCourseTopicActivity(
        userId,
        courseId,
        courseTopicActivityId
      )
    } catch (e) {
      console.error(`[CourseTopicActivityRecord.post] ${e.message}`)
      throw e
    }
  }
}
