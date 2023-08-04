import {
  Api,
  getFetchFunction,
  ServiceDependencies,
} from '../../lib/contexts/data-fetch'

export const getOrganizationGroupsById = async (
  orgId: string,
  {
    fetch = getFetchFunction(),
  }: ServiceDependencies<Api.Get.Fetch<'/organization/:id/groups'>> = {}
) => fetch(`/organization/${orgId}/groups`)

export const getProgressSummary = async (
  organizationId: string,
  selectedTime: Record<string, string> | string,
  {
    fetch = getFetchFunction(),
  }: ServiceDependencies<
    Api.Get.Fetch<'/reports/admin-progress-summary/:organizationId?daterange=:selectedTime'>
  > = {}
) =>
  fetch(
    `/reports/admin-progress-summary/${organizationId}?daterange=${JSON.stringify(
      selectedTime
    )}`
  )

export const getUserProgressSummary = async (
  userId: string,
  selectedTime: Record<string, string> | string,
  {
    fetch = getFetchFunction(),
  }: ServiceDependencies<
    Api.Get.Fetch<`/reports/user-progress-summary/:userid?daterange=:selectedTime`>
  > = {}
) =>
  fetch(
    `/reports/user-progress-summary/${userId}?daterange=${JSON.stringify(
      selectedTime
    )}`
  )

export const getSkillDistribution = (
  courseIds: string,
  selectedTime: Record<string, string>,
  {
    fetch = getFetchFunction(),
  }: ServiceDependencies<
    Api.Get.Fetch<`/reports/admin-skill-distribution/courses/:courseIds?daterange=:selectedTime`>
  > = {}
) =>
  fetch(
    `/reports/admin-skill-distribution/courses/${courseIds}?daterange=${JSON.stringify(
      selectedTime
    )}`
  )

export const getUserSkillDistribution = (
  userId: string,
  selectedTime: Record<string, string>,
  {
    fetch = getFetchFunction(),
  }: ServiceDependencies<
    Api.Get.Fetch<`/reports/user-skill-distribution/:userId?daterange=:selectedTime`>
  > = {}
) =>
  fetch(
    `/reports/user-skill-distribution/${userId}?daterange=${JSON.stringify(
      selectedTime
    )}`
  )

export const getLeaderBoard = (
  selectedTime: Record<string, string>,
  {
    fetch = getFetchFunction(),
  }: ServiceDependencies<
    Api.Get.Fetch<`/reports/leaderboard?daterange=:selectedTime`>
  > = {}
) => fetch(`/reports/leaderboard?daterange=${JSON.stringify(selectedTime)}`)

export const getActiveTopics = ({
  fetch = getFetchFunction(),
}: ServiceDependencies<Api.Get.Fetch<`/reports/active-topics`>> = {}) =>
  fetch(`/reports/active-topics`)

export const getCompletedActivities = async (
  userId: string,
  selectedTime: Record<string, string>,
  {
    fetch = getFetchFunction(),
  }: ServiceDependencies<
    Api.Get.Fetch<`/reports/completed-activities/:userId?daterange=:selectedTime`>
  > = {}
) => {
  return fetch(
    `/reports/completed-activities/${userId}?daterange=${JSON.stringify(
      selectedTime
    )}`
  )
}

export const getAdminCompletedActivities = async (
  selectedTime: Record<string, string>,
  {
    fetch = getFetchFunction(),
  }: ServiceDependencies<
    Api.Get.Fetch<`/reports/admin-completed-activities?daterange=:selectedTime`>
  > = {}
) => {
  return fetch(
    `/reports/admin-completed-activities?daterange=${JSON.stringify(
      selectedTime
    )}`
  )
}

export const getCourses = async ({
  fetch = getFetchFunction(),
}: ServiceDependencies<Api.Get.Fetch<'/courses'>> = {}) => fetch(`/courses`)

export const getUsersInOrganization = async ({
  fetch = getFetchFunction(),
}: ServiceDependencies<Api.Get.Fetch<'/user/usersInOrg'>> = {}) =>
  fetch(`/user/usersInOrg`)
