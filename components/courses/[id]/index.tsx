import { ChevronLeftIcon } from '@heroicons/react/24/outline'
import { Duration } from 'luxon'
import Head from 'next/head'
import { NextRouter, useRouter } from 'next/router'
import { useEffect } from 'react'
import Button from '../../../components/button'
import {
  Progress,
  SkillDifficultyLabel,
  TimeLabel,
} from '../../../components/card'
import ImageGallery from '../../../components/image-gallery'
import Layout from '../../../components/layout'
import { Link } from '../../../components/nav'
import Tabs, { ScrollableTabPanels } from '../../../components/tabs'
import { Tap, setDefaultProps } from '../../../lib'
import {
  useCurrentUser,
  useDataFetch,
  useDataMutation,
  useRole,
} from '../../../lib/contexts'
import { useAnalytics } from '../../../lib/contexts/analytics/analytics.provider'
import { Spinner } from '../../spinner'
import { fmtSubTopicStatus } from '../../topic'
import { CourseProgress } from '../components/course-card'
import {
  createCourseTopicActivityRecord,
  getCourseById,
  getCourseRecordById,
  getUserCourseRecords,
} from '../courses.service'
import CourseInstructor from './components/course-instructor'
import CourseTopic, { CourseActivityViewData } from './components/course-topic'
import { useScrollableHash } from './hooks'

type CourseOverviewQueryParams = { id: string; courseRecordId?: string }

type CourseOverviewProps = {
  getCourse?: (courseId: string) => Promise<Tap.Course>
  getCourseRecord?: (courseRecordId: string) => Promise<Tap.Course.Record>
  getUserCourseRecords?: (userId: string) => Promise<Tap.Course.Record[]>
  createCourseTopicActivityRecord?: (
    courseId: string,
    courseTopicActivityId: string
  ) => Promise<Partial<Tap.Course.TopicActivityRecord>>
}

export function CourseOverview({
  getCourse,
  getCourseRecord,
  getUserCourseRecords,
  createCourseTopicActivityRecord,
}: CourseOverviewProps) {
  const router: NextRouter = useRouter()
  const { id, courseRecordId } = router.query as CourseOverviewQueryParams
  const { isAdmin, isMember, isOwner } = useRole()
  const { user } = useCurrentUser()
  const { analytics } = useAnalytics()

  /**
   * @comment
   * leaving a note here to explain why this is here.
   * When the user first completes the first AU, the url
   * of the course overview page does not include the courseRecordId
   * Which is the cause of the SWR hook that our useDataFetch hook leverages
   * to not automatically revalidate. It is likely that the SWR hook is
   * automatically refreshing, however, the courseRecordId did not change
   * leading to the same empty array.
   *
   * Solution: we fetch the records for a user, and return the record for the
   * current course. Then we supply either this id, or the id from the url params.
   */
  const { data: userCourseRecords } = useDataFetch(
    `/user/${user?.id}/course-records`,
    {
      fetcher: async () => (user?.id ? getUserCourseRecords(user?.id) : []),
    }
  )
  const refreshedCourseRecord = userCourseRecords?.find(
    (record) => record.courseId === id
  )
  const refreshedCourseRecordId = courseRecordId || refreshedCourseRecord?.id
  const { data: courseRecord } = useDataFetch(
    `/course-record/${refreshedCourseRecordId}`,
    {
      fetcher: async () =>
        refreshedCourseRecordId
          ? getCourseRecord(refreshedCourseRecordId)
          : null,
    }
  )
  const { data: course } = useDataFetch(`/course/${id}`, {
    fetcher: async () => getCourse(id),
  })

  useEffect(() => {
    if (course) {
      analytics.page('Course Overview', {
        courseId: id,
        courseRecordId: courseRecordId,
        courseTitle: course.title,
      })
    }
  }, [analytics, id, courseRecordId, course])

  const topicRecords = courseRecord?.courseTopicRecords || []
  const getActivityRecords = (topic: Tap.Course.Topic) => {
    const topicRecord = topicRecords?.find(
      (topicRecord) => topicRecord.courseTopic?.id === topic.id
    )
    return topicRecord?.activityRecords || []
  }

  const isTopicLocked = (topicIndex: number) => {
    const isFirst = topicIndex === 0
    if (isFirst || isAdmin() || isOwner()) return false
    const previousTopic = course?.topics?.[topicIndex - 1]
    const previousTopicActivityRecords = getActivityRecords(previousTopic)
    return (
      !previousTopicActivityRecords.length ||
      previousTopicActivityRecords.length < previousTopic.activities?.length ||
      previousTopicActivityRecords.some(
        (activityRecord) => !activityRecord.completedAt
      )
    )
  }

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

  const viewCourseActivity = async (
    activity: CourseActivityViewData
  ): Promise<{ launchURL: string }> => {
    analytics.track(
      `Course Topic Activity ${fmtSubTopicStatus(activity.subTopicStatus)}`,
      {
        courseTopicActivityId: activity.courseTopicActivityId,
        courseTopicActivityTitle: activity.subTopicTitle,
      }
    )
    const { launchUrl } = await createCourseTopicActivityRecord(
      activity.courseId,
      activity.courseTopicActivityId
    )
    return { launchURL: launchUrl ? launchUrl : '' }
  }

  const tabs = ['About', 'Objectives', 'Modules', 'Instructors']
  const images = (course?.previewImages || [])
    .filter((asset) => asset.type === 'image')
    .map((asset) => asset.url)
    .filter((src) => !!src) as string[]
  const activeTab = useScrollableHash(
    typeof window !== 'undefined' ? window.location.hash.replace('#', '') : ''
  )
  const selectedTabIndex = tabs.findIndex((tab) => tab === activeTab)
  const progress = getCourseProgress(course, courseRecord)
  const { loading, mutate: launchFirstTopicActivity } = useDataMutation(
    async () => {
      const firstTopic = course?.topics?.find(
        (topic) => !isTopicLocked(course.topics.indexOf(topic))
      )
      const activityRecords = getActivityRecords(firstTopic)
      const firstTopicActivity = firstTopic?.activities?.find(
        (activity) =>
          !activityRecords.find(
            (activityRecord) =>
              activityRecord.courseTopicActivity?.id === activity.id
          )?.completedAt
      )
      analytics.track('Course Started', { id, title: course?.title })
      const { launchURL } = await viewCourseActivity({
        courseId: id,
        courseTopicId: firstTopic?.id || course?.topics?.[0].id,
        courseTopicActivityId:
          firstTopicActivity?.id ||
          firstTopic?.activities?.[0]?.id ||
          course?.topics?.[0].activities?.[0]?.id,
        subTopicStatus: 'pending',
        subTopicTitle: firstTopic?.title || course?.topics?.[0].title,
      })
      window.open(launchURL, '_blank', 'noopener,noreferrer')
    }
  )

  return (
    <>
      <Head>
        <title>TAP | Course Overview</title>
      </Head>
      <Layout>
        <div>
          {course ? (
            <>
              <div className="py-4">
                <div className="text-sm text-dark-secondary flex items-center justify-items-center py-4">
                  <Link href="/courses">
                    <ChevronLeftIcon className="w-4 h-4 inline" />
                    <span className="px-2">Back to courses</span>
                  </Link>
                </div>
                <div className="flex w-full items-start justify-items-start">
                  <div className="inline-block w-1/2">
                    <h1 className="font-heading text-h-lg text-dark-primary">
                      {course.title}
                    </h1>
                    <div className="flex flex-row p-2 text-dark-tertiary text-sm">
                      <TimeLabel
                        text={Duration.fromDurationLike({
                          minutes: course.lengthMin,
                        }).toHuman()}
                      />
                      <span className="inline-block px-2"></span>
                      <SkillDifficultyLabel difficulty={course.level} />
                    </div>
                  </div>
                  <div className="inline-block w-1/2 text-right">
                    {isMember() ? (
                      progress && progress.total !== 0 ? (
                        <Progress
                          className="p-2 text-sm text-dark-tertiary"
                          value={(progress.completed / progress.total) * 100}
                        >
                          {progress.completed}/{progress.total}
                        </Progress>
                      ) : (
                        <Button
                          className="px-16 py-2 text-sm"
                          theme="blue"
                          onClick={launchFirstTopicActivity}
                        >
                          {loading ? (
                            <Spinner borderColor={'#0069E4'} className="mx-8" />
                          ) : (
                            'Start Course'
                          )}
                        </Button>
                      )
                    ) : null}
                  </div>
                </div>
              </div>
              {images.length ? <ImageGallery images={images} /> : null}
              <div className="pt-8 pb-16">
                <Tabs
                  selectedTabIndex={selectedTabIndex}
                  tabHeaders={tabs}
                  Panels={ScrollableTabPanels}
                  bottomDivider
                >
                  <div
                    data-scrollable-id="About"
                    className="text-dark-primary py-4 border-b border-gray-2"
                  >
                    <h2 className="font-heading text-h-sm py-4">
                      About This Course
                    </h2>
                    <p className="py-2 text-sm">{course.description}</p>
                  </div>
                  <div
                    data-scrollable-id="Objectives"
                    className="text-dark-primary py-4 border-b border-gray-2"
                  >
                    <h2 className="font-heading text-h-sm py-4">
                      Course Objectives
                    </h2>
                    <ul className="py-1 text-sm">
                      {course?.objectives?.map((objective, i) => (
                        <li
                          key={`${objective}-${i}`}
                          className="py-1 list-disc list-inside"
                        >
                          {objective}
                        </li>
                      ))}
                    </ul>
                    <p className="py-2 text-sm"></p>
                  </div>
                  <div
                    data-scrollable-id="Topics"
                    className="text-dark-primary py-4 border-b border-gray-2"
                  >
                    <h2 className="font-heading text-h-sm py-4">Modules</h2>
                    <div>
                      {course.topics?.map((topic, $t) => {
                        const activityRecords = getActivityRecords(topic)
                        return (
                          <CourseTopic
                            key={`${course.id}-${$t}`}
                            className="my-2"
                            topic={{
                              ...topic,
                              course: {
                                id: course.id,
                              },
                            }}
                            activityRecords={activityRecords}
                            locked={isTopicLocked($t)}
                            viewCourseActivity={viewCourseActivity}
                            shouldDisplayViewAction={isAdmin() || isOwner()}
                          />
                        )
                      })}
                    </div>
                  </div>
                  <div
                    data-scrollable-id="Instructors"
                    className="text-dark-primary py-4 border-b border-gray-2"
                  >
                    <h2 className="font-heading text-h-sm py-4">Instructors</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {course.instructors?.map((instructor, i) => (
                        <CourseInstructor
                          key={`${course.id}-${i}`}
                          className="p-2"
                          instructor={instructor}
                        />
                      ))}
                    </div>
                  </div>
                </Tabs>
              </div>
            </>
          ) : null}
        </div>
      </Layout>
    </>
  )
}

setDefaultProps(CourseOverview, {
  getCourse: getCourseById,
  getCourseRecord: getCourseRecordById,
  getUserCourseRecords: getUserCourseRecords,
  createCourseTopicActivityRecord,
})

export default CourseOverview
