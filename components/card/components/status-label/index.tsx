import classNames from 'classnames'
import React from 'react'
import { setDefaultProps } from '../../../../lib/utils'

type StatusLabelProps = {
  children: any
  className?: any
  theme: OneOf<'green' | 'blue' | 'gray'>
} & React.HTMLAttributes<HTMLDivElement>

function StatusLabel(
  { children, className, theme, ...props }: StatusLabelProps,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  return (
    <div
      {...props}
      ref={ref}
      className={classNames(
        className,
        'px-4 py-2 absolute right-0 top-0 text-sm',
        {
          'bg-green-5 text-white': theme === 'green',
          'bg-blue-4 text-dark-primary': theme === 'blue',
          'bg-gray-5 text-dark-primary': theme === 'gray',
        }
      )}
    >
      {children}
    </div>
  )
}

const ForwardedRefStatusLabel = React.forwardRef(StatusLabel)

setDefaultProps(ForwardedRefStatusLabel, {})

export default ForwardedRefStatusLabel

export { ForwardedRefStatusLabel as StatusLabel }
