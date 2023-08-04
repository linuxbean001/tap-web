import classNames from 'classnames/dedupe'
import React from 'react'
import { setDefaultProps } from '../../lib'

type SkeletonProps = {
  children?: any
  className?: any
} & React.HTMLAttributes<HTMLDivElement>

function Skeleton(
  { children, className, ...props }: SkeletonProps,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  return (
    <div
      className={classNames('bg-gray-3 animate-pulse', className)}
      {...props}
      ref={ref}
    >
      {children}
    </div>
  )
}

const ForwardedRefSkeleton = React.forwardRef(Skeleton)

setDefaultProps(ForwardedRefSkeleton, {})

export default ForwardedRefSkeleton

export { ForwardedRefSkeleton as Skeleton }
