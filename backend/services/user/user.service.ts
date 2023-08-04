import { OrgIdToOrgMemberInfo, UsersPagedResponse } from '@propelauth/express'
import { Knex } from 'knex'
import { toCamel } from 'snake-camel'
import { Tap, assert } from '../../../lib'
import User from '../../../lib/domain/user'
import {
  FieldsQueryResult,
  ReferencesQueryResult,
} from '../../middleware/fields'
import { getErrorMessage } from '../../utils/errors'
import { CourseRecordService } from '../course/course-record/course-record.service'
import { WithTimestamps } from '../db'
import knex from '../db/conn.knex'
import { PropelAuth } from '../propel/propel.service'

const ROLES = {
  Member: 0,
  Admin: 1,
  Owner: 2,
}

export default class UserService {
  db: Knex

  constructor(db: Knex = knex) {
    this.db = db
  }

  async getUserById(id: string): Promise<User | null> {
    try {
      const userMetaData = assert(
        await PropelAuth().fetchUserMetadataByUserId(id, true)
      )
      const { organization, role } = this.getUserOrgInfo(
        assert(userMetaData.orgIdToOrgInfo)
      )
      const groups = await this.getUserGroups(id)

      return {
        id: userMetaData.userId,
        email: userMetaData.email,
        firstName: userMetaData.firstName || '',
        lastName: userMetaData.lastName || '',
        organization,
        role,
        groups,
      }
    } catch (err) {
      console.error(getErrorMessage(err))
      return null
    }
  }

  /*
   * While propel allows users to be part of multiple organizations
   * we require that users belong to only one organization.
   */
  getUserOrgInfo(orgInfo: OrgIdToOrgMemberInfo): {
    organization: Tap.User.Organization | null
    role: Tap.User['role']
  } {
    const orgIds = Object.keys(orgInfo)
    if (orgIds.length > 0) {
      const org: any = orgInfo[orgIds[0]]
      const assignedRole = org.assignedRole || org.userAssignedRole
      const role =
        assignedRole in ROLES
          ? (ROLES as Record<string, User['role']>)[org.userAssignedRole]
          : 0
      return {
        role,
        organization: {
          id: org.orgId,
          name: org.orgName,
        } as Tap.User.Organization,
      }
    }
    return { role: -1, organization: null }
  }

  async getUsers({
    getUsers = () =>
      PropelAuth()
        .fetchUsersByQuery({ includeOrgs: true, pageSize: 100 })
        .then((res) => res.users),
  } = {}): Promise<Tap.User[]> {
    const users = await getUsers()
    return users
      .filter((user) => user.enabled)
      .map((user) => {
        const { role, organization } = this.getUserOrgInfo(
          assert(user.orgIdToOrgInfo)
        )
        return {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          groups: [],
          id: user.userId,
          role,
          organization,
        }
      })
  }

  async getUsersInOrg(
    orgId: string,
    {
      getUsersInOrg = (orgId: string, pageNumber: number = 0) =>
        PropelAuth()
          .fetchUsersInOrg({
            orgId,
            pageNumber,
            pageSize: 50,
            includeOrgs: true,
          })
          .then((res) => res),
    } = {}
  ): Promise<Tap.User[]> {
    const users = []
    let resp: UsersPagedResponse = await getUsersInOrg(orgId)
    users.push(...resp.users)
    while (resp.hasMoreResults) {
      resp = await getUsersInOrg(orgId, (resp.currentPage += 1))
      users.push(...resp.users)
    }
    return users
      .filter((user) => user.enabled)
      .map((user) => {
        const { role, organization } = this.getUserOrgInfo(
          assert(user.orgIdToOrgInfo)
        )
        return {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          groups: [],
          id: user.userId,
          role,
          organization,
        }
      })
  }

  async getUserGroups(
    userId: string,
    {
      getGroupIds = () =>
        knex('user_to_group')
          .where({ user_id: userId })
          .then((userToGroups) => userToGroups.map((ug) => ug.user_group_id)),
      getGroup = (groupId: string) =>
        knex('user_group').where({ id: groupId }).first(),
    } = {}
  ): Promise<User.Group[]> {
    const groupIds = await getGroupIds()
    const groups = await Promise.all(groupIds.map(getGroup))
    return groups.map(toCamel)
  }

  async getUserCourseRecords(
    userId: string,
    {
      fields = ['*'] as FieldsQueryResult<Tap.Course.Record>,
      references = {} as ReferencesQueryResult<Tap.Course.Record>,
      getUserCourseRecords = (userId: string, { fields, references }) =>
        new CourseRecordService(this.db).getCourseRecords(
          { userId },
          { fields, references }
        ),
    } = {}
  ): Promise<WithTimestamps<Tap.Course.Record>[]> {
    return getUserCourseRecords(userId, { fields, references })
  }
}
