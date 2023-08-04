import classNames from 'classnames'
import Image from 'next/image'
import React from 'react'
import Avatar from '../../../../../components/avatar'
import {
  getUserInitials,
  getUsername,
} from '../../../../../components/nav/utils'
import { Tap } from '../../../../../lib'

type CourseInstructorProps = {
  children?: any
  className?: any
  instructor: Tap.Instructor
} & React.HTMLAttributes<HTMLDivElement>

function CourseInstructor(
  { children, className, instructor, ...props }: CourseInstructorProps,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  const name = getUsername({
    email: '',
    firstName: instructor.firstName,
    lastName: instructor.lastName,
  })
  const initials = getUserInitials(name)
  return (
    <div
      {...props}
      className={classNames('flex flex-row', className)}
      ref={ref}
    >
      <div className="flex w-1/12 items-start justify-center">
        <Avatar className="overflow-hidden" theme="gray">
          {instructor.avatar &&
          instructor.avatar.type === 'image' &&
          typeof instructor.avatar.url === 'string' ? (
            <Image
              src={instructor.avatar.url}
              className="w-full"
              width={48}
              height={48}
              alt={name}
            />
          ) : (
            initials
          )}
        </Avatar>
      </div>
      <div className="w-11/12">
        <h4 className="font-heading text-h-sm text-dark-primary py-1">
          {name}
        </h4>
        <p className="text-sm text-dark-secondary pb-2">{instructor.title}</p>
        <p className="text-sm text-dark-secondary">{instructor.description}</p>
      </div>
    </div>
  )
}

const ForwardedRefCourseInstructor = React.forwardRef(CourseInstructor)

export default ForwardedRefCourseInstructor

export { ForwardedRefCourseInstructor as CourseInstructor }
