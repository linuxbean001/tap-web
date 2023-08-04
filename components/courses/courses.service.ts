import {
  Api,
  getFetchFunction,
  ServiceDependencies,
} from '../../lib/contexts/data-fetch'

export const getCourses = async ({
  fetch = getFetchFunction(),
}: ServiceDependencies<Api.Get.Fetch<'/courses'>> = {}) => fetch(`/courses`)

export const getCourseById = async (
  courseId: string,
  {
    fetch = getFetchFunction(),
  }: ServiceDependencies<Api.Get.Fetch<'/course/:id'>> = {}
) => fetch(`/course/${courseId}`)

export const getCourseCategories = async ({
  fetch = getFetchFunction(),
}: ServiceDependencies<Api.Get.Fetch<'/course-categories'>> = {}) =>
  fetch(`/course-categories`)

export const getUserCourseRecords = async (
  userId: string,
  {
    fetch = getFetchFunction(),
  }: ServiceDependencies<Api.Get.Fetch<'/user/:id/course-records'>> = {}
) => fetch(`/user/${userId}/course-records`)

export const getCourseRecordById = async (
  courseRecordId: string,
  {
    fetch = getFetchFunction(),
  }: ServiceDependencies<Api.Get.Fetch<'/course-record/:id'>> = {}
) => fetch(`/course-record/${courseRecordId}`)

export const createCourseRecord = async (
  userId: string,
  courseId: string,
  {
    fetch = getFetchFunction(),
  }: ServiceDependencies<Api.Post.Fetch<'/course-record'>> = {}
) =>
  fetch(`/course-record`, {
    method: 'post',
    body: JSON.stringify({
      userId,
      courseId,
    }),
  })

export const createCourseTopicRecord = async (
  courseTopicId: string,
  courseRecordId: string,
  {
    fetch = getFetchFunction(),
  }: ServiceDependencies<Api.Post.Fetch<'/course-topic-record'>> = {}
) =>
  fetch(`/course-topic-record`, {
    method: 'post',
    body: JSON.stringify({
      courseTopicId,
      courseRecordId,
    }),
  })

export const createCourseTopicActivityRecord = async (
  courseId: string,
  courseTopicActivityId: string,
  {
    fetch = getFetchFunction(),
  }: ServiceDependencies<Api.Post.Fetch<'/course-topic-activity-record'>> = {}
) =>
  fetch(`/course-topic-activity-record`, {
    method: 'post',
    body: JSON.stringify({
      courseId,
      courseTopicActivityId,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
