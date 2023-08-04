import { Duration } from 'luxon'
import Image from 'next/image'
import React from 'react'

import Card, {
  Progress,
  SkillDifficultyLabel,
  StatusLabel,
  TimeLabel,
} from '../../../../components/card'
import { Link } from '../../../../components/nav'
import { Tap, setDefaultProps } from '../../../../lib'
import { useRole } from '../../../../lib/contexts'

export type CourseProgress = { completed: number; total: number }
type CourseCardProps = {
  children?: any
  className?: any
  course: Tap.Course
  courseRecord?: Tap.Course.Record
  progress?: CourseProgress
} & React.HTMLAttributes<HTMLAnchorElement>

const ConditionalWrapper = ({ condition, wrapper, children }) =>
  condition ? wrapper(children) : children

function CourseCard(
  {
    children,
    className,
    course,
    courseRecord,
    progress,
    ...props
  }: CourseCardProps,
  ref: React.ForwardedRef<HTMLAnchorElement>
) {
  const { isMember } = useRole()

  const searchParams = courseRecord
    ? `?${new URLSearchParams({ courseRecordId: courseRecord.id }).toString()}`
    : ''
  const href = `/courses/${course.id}${searchParams}`
  const courseDescriptionPreview = course.description
    ? `${course.description.split('.')[0] || ''}.`
    : ''

  return (
    <ConditionalWrapper
      condition={course.published}
      wrapper={(children) => (
        <Link href={href} className="hover:underline" {...props} ref={ref}>
          {children}{' '}
        </Link>
      )}
    >
      <Card
        className="h-full justify-between"
        Image={
          course.thumbnail?.url && course.thumbnail?.type === 'image' ? (
            <Image
              src={course.thumbnail.url}
              alt={`Course Image for ${course.title}`}
              width={640}
              height={480}
              className="w-full h-auto object-cover"
            />
          ) : null
        }
      >
        <div className="p-4 bg-gray-13">
          <h4 className="font-body text-md font-bold p-2">{course.title}</h4>
          {course.published ? (
            isMember() && courseRecord?.id ? (
              <StatusLabel theme="green">Started</StatusLabel>
            ) : (
              <StatusLabel theme="gray">{course?.category?.label}</StatusLabel>
            )
          ) : (
            <StatusLabel theme="blue">Coming Soon</StatusLabel>
          )}
          {isMember() && course.published && courseRecord?.id ? (
            <Progress
              className="p-2 text-sm text-dark-tertiary"
              value={(progress.completed / progress.total) * 100}
            >
              {progress.completed}/{progress.total}
            </Progress>
          ) : (
            <div className="flex flex-row p-2 text-dark-tertiary text-sm">
              <TimeLabel
                text={Duration.fromDurationLike({
                  minutes: course.lengthMin,
                }).toHuman()}
              />
              <span className="inline-block px-2"></span>
              <SkillDifficultyLabel difficulty={course.level} />
            </div>
          )}

          <div className="p-2 text-dark-secondary text-sm">
            <p>{courseDescriptionPreview}</p>
          </div>
        </div>
      </Card>
    </ConditionalWrapper>
  )
}

const ForwardedRefCourseCard = React.forwardRef(CourseCard)

setDefaultProps(ForwardedRefCourseCard, {})

export default ForwardedRefCourseCard

export { ForwardedRefCourseCard as CourseCard }
