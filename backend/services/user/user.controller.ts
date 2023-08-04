import { Catch, Get, Param } from 'next-api-decorators'
import { Tap } from '../../../lib'
import { AuthGuard, AuthUser } from '../../middleware'
import type { FieldsQueryResult } from '../../middleware/fields'
import {
  AllowedFields,
  AllowedReferences,
  FieldsQuery,
  ReferencesQuery,
} from '../../middleware/fields'
import type { ReferencesQueryResult } from '../../middleware/fields/references'
import { exceptionHandler, getErrorMessage } from '../../utils/errors'
import Controller from '../xapi/base.controller'
import UserService from './user.service'

@AuthGuard()
@Catch(exceptionHandler)
export default class UserController extends Controller {
  users: UserService

  constructor(userService: UserService = new UserService()) {
    super()
    this.users = userService
  }

  @Get('/me')
  async me(@AuthUser() user: Tap.User) {
    try {
      if (!user) throw new Error('Failed to retrieve user')
      return user
    } catch (e) {
      console.error(`[User.me] ${getErrorMessage(e)}`)
      throw e
    }
  }

  @Get('/usersInOrg')
  async getUsersInOrg(@AuthUser() user: Tap.User) {
    try {
      if (!user) throw new Error('Failed to retrieve user')
      const orgId: string = user?.organization?.id
      return await this.users.getUsersInOrg(orgId)
    } catch (e) {
      console.error(`[User.me] ${getErrorMessage(e)}`)
      throw e
    }
  }

  @Get('/:userId/course-records')
  async getUserCourseRecords(
    @Param('userId') userId: string,
    @FieldsQuery(AllowedFields.CourseRecord)
    fields: FieldsQueryResult<Tap.Course.Record>,
    @ReferencesQuery(AllowedReferences.CourseRecord)
    references: ReferencesQueryResult<Tap.Course.Record>
  ) {
    try {
      return this.users.getUserCourseRecords(userId, { fields, references })
    } catch (e) {
      console.error(`[User.getUserCourseRecords] ${getErrorMessage(e)}`)
      throw e
    }
  }
}
