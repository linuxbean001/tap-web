import classNames from 'classnames/dedupe'
import React from 'react'
import { setDefaultProps } from '../../../../lib/utils'

type ProgressProps = {
  children?: any
  className?: any
  /** between 0 and 100 */
  value: number
} & React.HTMLAttributes<HTMLDivElement>

function Progress(
  { children, className, value, ...props }: ProgressProps,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  return (
    <div {...props} ref={ref} className={classNames(className, 'flex w-full')}>
      <div className="flex w-11/12 pr-2 items-center justify-items-center">
        <div className="bg-gray-4 w-full">
          <div
            className="h-full px-1 bg-green-5"
            style={{
              width: `${value}%`,
              paddingTop: '2px',
              paddingBottom: '2px',
            }}
          ></div>
        </div>
      </div>

      <div className="inline-block w-1/12 pl-2">{children}</div>
    </div>
  )
}

const ForwardedRefProgress = React.forwardRef(Progress)

setDefaultProps(ForwardedRefProgress, {})

export default ForwardedRefProgress

export { ForwardedRefProgress as Progress }
