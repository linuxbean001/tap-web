import _ from 'lodash'
import Head from 'next/head'
import Router, { NextRouter, useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { listToMap } from '../../backend/utils'
import Layout from '../../components/layout'
import { isRouterActive, Tap } from '../../lib'
import { useCurrentUser, useDataFetch } from '../../lib/contexts'
import { useAnalytics } from '../../lib/contexts/analytics/analytics.provider'
import Spinner from '../spinner'
import CourseCard, { CourseProgress } from './components/course-card'
import CourseCategoryMenu from './components/course-category-menu'
import { Jumbotron } from './components/jumbotron'
import { getCourses, getUserCourseRecords } from './courses.service'

type CourseListProps = {
  children?: any
  className?: any
  getCourses?: typeof getCourses
  getUserCourseRecords?: typeof getUserCourseRecords
}

export function CourseList({
  getUserCourseRecords,
  getCourses,
}: CourseListProps) {
  const router: NextRouter = useRouter()
  const query = router?.query || {}
  const { user } = useCurrentUser()
  const { analytics } = useAnalytics()

  const [coursesByCategory, setCoursesByCategory] = useState<{
    [category: string]: Tap.Course[]
  }>({})
  const [courseRecordMap, setCourseRecordMap] = useState<{
    [courseId: string]: Tap.Course.Record
  }>({})

  const courseFetch = useDataFetch(`/courses`, {
    fetcher: async () => await getCourses(),
  })

  const courseRecordsFetch = useDataFetch(`/user/${user?.id}/course-records`, {
    fetcher: async () => (user?.id ? await getUserCourseRecords(user?.id) : []),
  })

  useEffect(() => {
    if (!Array.isArray(courseFetch.data)) {
      return
    }
    const categorizedCourses = courseFetch.data.reduce(
      (dict: Record<string, Tap.Course[]>, course) => ({
        ...dict,
        [course.category.label]: [
          ...(dict[course.category.label] || []),
          course,
        ],
      }),
      {}
    )
    setCoursesByCategory(categorizedCourses)
  }, [courseFetch.data, user])

  useEffect(() => {
    if (!Array.isArray(courseRecordsFetch.data)) return
    setCourseRecordMap(listToMap(courseRecordsFetch.data, 'courseId'))
  }, [courseRecordsFetch.data])

  useEffect(() => {
    analytics.page('Courses')
  }, [analytics])

  const getCourseProgress = (
    course: Tap.Course,
    record: Tap.Course.Record
  ): CourseProgress | null => {
    return record
      ? {
          completed: record.courseTopicRecords?.filter((topicRecord) =>
            topicRecord.activityRecords?.every(
              (activityRecord) => activityRecord.completedAt
            )
          ).length,
          total: course?.topics?.length || 0,
        }
      : null
  }

  const filteredCategorizedCourses = _.orderBy(
    Object.entries(coursesByCategory).filter(([category]) =>
      query.category ? query.category === category : true
    )
  )

  const combinedCourses = filteredCategorizedCourses
    .map((item) => item[1])
    .flat()

  return (
    <>
      <Head>
        <title>TAP | Courses</title>
      </Head>
      <Layout>
        <Jumbotron />
        <CourseCategoryMenu
          className="mb-12 sm:mb-8 lg:mb-16"
          isActive={(href) => href === (isRouterActive() ? Router.asPath : '')}
        />
        {courseFetch.isLoading || courseRecordsFetch.isLoading ? (
          <div className="flex items-center justify-center p-8">
            <Spinner borderColor={'#0069E4'} size={24} />
          </div>
        ) : courseFetch.error || courseRecordsFetch.error ? (
          <h3 className="font-heading text-h-sm text-center p-8">
            Could not fetch courses
          </h3>
        ) : filteredCategorizedCourses.length ? (
          <div className="py-2 grid md:grid-cols-3 gap-4">
            {combinedCourses.map((course) => {
              const record = courseRecordMap[course.id]
              return (
                <CourseCard
                  key={course.id}
                  course={course}
                  courseRecord={record}
                  progress={getCourseProgress(course, record)}
                />
              )
            })}
          </div>
        ) : (
          <h3 className="font-heading text-h-sm text-center p-8">
            No courses found
          </h3>
        )}
        <div className="p-16"></div>
      </Layout>
    </>
  )
}

CourseList.defaultProps = {
  getUserCourseRecords,
  getCourses,
} as Partial<CourseListProps>

export default CourseList
