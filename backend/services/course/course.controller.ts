import { Catch, Get, NotFoundException, Param } from 'next-api-decorators'

import { Tap } from '../../../lib'
import { AuthGuard, AuthUser } from '../../middleware'
import type {
  FieldsQueryResult,
  ReferencesQueryResult,
} from '../../middleware/fields'
import {
  AllowedFields,
  AllowedReferences,
  FieldsQuery,
  ReferencesQuery,
} from '../../middleware/fields'
import { exceptionHandler } from '../../utils/errors'
import { CourseService } from './course.service'

@Catch(exceptionHandler)
export default class CourseController {
  courseService: CourseService

  constructor(courseService = new CourseService()) {
    this.courseService = courseService
  }

  @Get('/')
  @AuthGuard()
  public async getCourses(
    @AuthUser() user: Tap.User,
    @FieldsQuery(AllowedFields.Course)
    fields: FieldsQueryResult<Tap.Course>,
    @ReferencesQuery(
      [...AllowedReferences.Course, 'topicActivities'],
      AllowedReferences.Course
    )
    references: ReferencesQueryResult<Tap.Course>
  ) {
    const organizationId: string = user.organization.id
    return this.courseService.getCourses({ organizationId, fields, references })
  }

  @Get('/:courseId')
  @AuthGuard()
  public async getCourse(
    @Param('courseId') courseId: string,
    @FieldsQuery(AllowedFields.Course)
    fields: FieldsQueryResult<Tap.Course>,
    @ReferencesQuery(AllowedReferences.Course)
    references: ReferencesQueryResult<Tap.Course>
  ) {
    const course = await this.courseService.getCourse(courseId, {
      fields,
      references,
    })
    if (!course) {
      throw new NotFoundException(`Course not found: ${courseId}`)
    }
    return course
  }
}
