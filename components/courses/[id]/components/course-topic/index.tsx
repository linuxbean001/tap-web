import classNames from 'classnames'
import React, { useState } from 'react'
import {
  SubTopicStatus,
  Topic,
  TopicProps,
  TopicStatus,
} from '../../../../../components/topic'
import { Tap } from '../../../../../lib'
import { useDataMutation } from '../../../../../lib/contexts'

export type CourseActivityViewData = {
  courseId: string
  courseTopicId: string
  courseTopicActivityId: string
  subTopicStatus: SubTopicStatus
  subTopicTitle: string
}
type CourseTopicProps = {
  children?: any
  className?: any
  topic: Tap.Course.Topic
  activityRecords?: Tap.Course.TopicActivityRecord[]
  locked: boolean
  shouldDisplayViewAction?: boolean
  isOpen?: boolean
  viewCourseActivity: (
    activity: CourseActivityViewData
  ) => Promise<{ launchURL: string }>
} & React.HTMLAttributes<HTMLDivElement>

function CourseTopic(
  {
    children,
    className,
    topic,
    activityRecords,
    locked,
    isOpen,
    shouldDisplayViewAction,
    viewCourseActivity,
    ...props
  }: CourseTopicProps,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  const status = locked
    ? 'locked'
    : (classNames({
        incompleted: activityRecords?.some(
          (activityRecord) => !activityRecord.completedAt
        ),
        completed:
          activityRecords?.length &&
          activityRecords?.every(
            (activityRecord) => activityRecord.completedAt
          ),
        locked,
      } as Record<TopicStatus, boolean>) as TopicStatus)

  const getActivityRecord = (
    activity: Tap.Course.TopicActivity
  ): Tap.Course.TopicActivityRecord =>
    activityRecords?.find(
      (activityRecord) => activityRecord.courseTopicActivity?.id === activity.id
    )
  const nextActivity: Tap.Course.TopicActivity = locked
    ? null
    : topic.activities?.find((activity) => {
        const activityRecord = getActivityRecord(activity)
        return !activityRecord?.completedAt
      })
  const [activityData, setActivityData] = useState<CourseActivityViewData>()
  const { loading, mutate } = useDataMutation(
    async (data: CourseActivityViewData) => {
      setActivityData(data)
      const { launchURL } = await viewCourseActivity(data)
      window.open(launchURL, '_blank', 'noopener,noreferrer')
    }
  )

  return (
    <Topic<CourseActivityViewData>
      {...props}
      ref={ref}
      isOpen={isOpen}
      className={className}
      id={topic.id}
      status={status}
      title={topic.title}
      description={topic.description}
      subtopics={
        topic.activities
          ?.filter((val) => val.isVrOnly === false)
          .map((activity) => {
            const activityRecord = activityRecords?.find(
              (activityRecord) =>
                activityRecord.courseTopicActivity?.id === activity.id
            )
            const subTopicStatus = shouldDisplayViewAction
              ? 'can-view'
              : locked
              ? 'locked'
              : activityRecord?.completedAt
              ? 'completed'
              : nextActivity?.id === activity?.id
              ? activityRecord
                ? 'in-progress'
                : 'pending'
              : 'locked'
            return {
              title: activity?.title,
              description: activity?.description,
              status: subTopicStatus,
              isLoading:
                loading &&
                activityData?.courseId === topic.course?.id &&
                activityData?.courseTopicActivityId === activity.id,
              data: {
                courseId: topic.course?.id,
                courseTopicId: topic.id,
                courseTopicActivityId: activity.id,
                subTopicStatus,
                subTopicTitle: activity.title,
              },
            }
          }) as TopicProps['subtopics']
      }
      onViewAction={(data) => mutate(data)}
    />
  )
}

const ForwardedRefCourseTopic = React.forwardRef(CourseTopic)

export default ForwardedRefCourseTopic

export { ForwardedRefCourseTopic as CourseTopic }
