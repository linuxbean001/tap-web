import { Tap } from '../../../domain'
import { DataFetchFunction } from '../data-fetch.function'

export const apiPrefix = '/api/v1'

/**
 * The Api namespace provides mappings of relative API endpoints, to response data type definitions.
 * This is very useful in knowing what data to expect from our Tap3D APIs, when we make requests like:
 *
 * @example
 * const res = useDataFetch("/user/me") as { data: Tap.User }
 */
export namespace Api {
  export type Post = {
    '/course-record': { id: string }
    '/course-topic-record': { id: string }
    '/course-topic-activity-record': Partial<Tap.Course.TopicActivityRecord>
  }

  export namespace Post {
    export type Fetch<TKey extends keyof Api.Post> = DataFetchFunction<
      Api.Post[TKey],
      Api.KeyPattern<TKey>
    >
  }

  export type Get = {
    '/user/me'?: Tap.User
    '/user/usersInOrg'?: Tap.User[]
    '/courses': Tap.Course[]
    '/course/:id': Tap.Course
    '/user/:id/course-records': Tap.Course.Record[]
    '/course-record/:id': Tap.Course.Record
    '/course-categories': Tap.Course.Category[]
    '/organization/:id/groups': Tap.User.Group[]
    '/reports/user-progress-summary/:userid?daterange=:selectedTime': Tap.Report.UserProgressSummary
    '/reports/user-skill-distribution/:userId?daterange=:selectedTime': Tap.Report.UserSkillDistribution
    '/reports/admin-progress-summary/:organizationId?daterange=:selectedTime': Tap.Report.AdminProgressSummary
    '/reports/admin-skill-distribution/courses/:courseIds?daterange=:selectedTime': Tap.Report.SkillDistribution
    '/reports/leaderboard?daterange=:selectedTime': Tap.Report.Leaderboard
    '/reports/completed-activities/:userId?daterange=:selectedTime': Tap.Report.CompletedActivities
    '/reports/admin-completed-activities?daterange=:selectedTime': Tap.Report.CompletedActivities
    '/reports/active-topics': Tap.Report.ActiveTopics
  }

  export namespace Get {
    export type Fetch<TKey extends keyof Api.Get> = DataFetchFunction<
      Api.Get[TKey],
      Api.KeyPattern<TKey>
    >
  }

  export type KeyPattern<
    TKey extends string,
    TEndpoint extends string = '',
    TLastAppend extends string = '',
    TIsInterpolation extends boolean = false
  > = TKey extends ''
    ? TEndpoint
    : TKey extends `/${infer TRest}`
    ? KeyPattern<TRest, `${TEndpoint}/`, '/'>
    : TKey extends `:${infer TRest}`
    ? KeyPattern<TRest, `${TEndpoint}`, ':'>
    : TKey extends `${infer TFirst}${infer TRest}`
    ? TLastAppend extends ':'
      ? KeyPattern<
          TRest,
          `${TEndpoint}${TIsInterpolation extends true ? '' : string}`,
          `:`,
          true
        >
      : KeyPattern<
          TRest,
          `${TEndpoint}${TLastAppend extends '' ? '' : TFirst}`,
          TFirst
        >
    : never
}

export const getApiFallbackData = (): Api.Get => ({
  '/user/me': null,
  '/user/usersInOrg': [],
  '/courses': [],
  '/course/:id': null,
  '/course-categories': [],
  '/course-record/:id': null,
  '/organization/:id/groups': [],
  '/user/:id/course-records': [],
  '/reports/user-progress-summary/:userid?daterange=:selectedTime': null,
  '/reports/user-skill-distribution/:userId?daterange=:selectedTime': null,
  '/reports/admin-progress-summary/:organizationId?daterange=:selectedTime':
    null,
  '/reports/admin-skill-distribution/courses/:courseIds?daterange=:selectedTime':
    null,
  '/reports/leaderboard?daterange=:selectedTime': [],
  '/reports/completed-activities/:userId?daterange=:selectedTime': [],
  '/reports/admin-completed-activities?daterange=:selectedTime': [],
  '/reports/active-topics': null,
})
