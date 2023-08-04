import { Catch, Get, Param, Query } from 'next-api-decorators'

import { Tap } from '../../../../lib'
import { AuthGuard, AuthUserId } from '../../../middleware'
import type { FieldsQueryResult } from '../../../middleware/fields'
import { AllowedFields, FieldsQuery } from '../../../middleware/fields'
import { exceptionHandler } from '../../../utils/errors'
import { CourseRecordService } from './course-record.service'

@Catch(exceptionHandler)
export default class CourseRecordController {
  courseRecordService: CourseRecordService

  constructor(courseRecordService = new CourseRecordService()) {
    this.courseRecordService = courseRecordService
  }

  @Get('/')
  @AuthGuard()
  public async getCourseRecords(
    @AuthUserId() userId: string,
    @Query('courseId') courseId: string,
    @FieldsQuery(AllowedFields.CourseRecord)
    fields: FieldsQueryResult<Tap.Course.Record>
  ) {
    return this.courseRecordService.getCourseRecords(
      { userId, courseId },
      { fields }
    )
  }

  @Get('/:courseRecordId')
  @AuthGuard()
  public async getCourseRecord(
    @Param('courseRecordId') courseRecordId: string,
    @FieldsQuery(AllowedFields.CourseRecord)
    fields: FieldsQueryResult<Tap.Course.Record>
  ) {
    return this.courseRecordService.getCourseRecord(
      { id: courseRecordId },
      { fields }
    )
  }
}
