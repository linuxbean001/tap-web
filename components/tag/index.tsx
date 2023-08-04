import classNames from 'classnames'
import React from 'react'
import { setDefaultProps } from '../../lib/utils'

type TagProps = {
  label: string
  className?: any
} & React.HTMLAttributes<HTMLLabelElement>

function Tag(
  { className, label, ...props }: TagProps,
  ref: React.ForwardedRef<HTMLLabelElement>
) {
  return (
    <label
      {...props}
      className={classNames(
        className,
        'inline-block bg-gray-3 text-dark-primary text-xs px-2 py-1'
      )}
      ref={ref}
    >
      {label}
    </label>
  )
}

const ForwardedRefTag = React.forwardRef(Tag)

setDefaultProps(ForwardedRefTag, {})

export default ForwardedRefTag

export { ForwardedRefTag as Tag }
