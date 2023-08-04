import css from './spinner.module.css'

import classNames from 'classnames'
import React from 'react'
import { setDefaultProps } from '../../lib'

type SpinnerProps = {
  size?: string | number
  borderWidth?: string
  borderColor?: string
  className?: any
} & React.HTMLAttributes<HTMLDivElement>

function Spinner(
  { size, borderWidth, borderColor, className, ...props }: SpinnerProps,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  const spinnerClasses = classNames('inline-block', className, css.spinner)
  return (
    <div
      ref={ref}
      className={spinnerClasses}
      style={{
        width: size,
        height: size,
        borderWidth,
        ...(borderColor ? { borderColor } : {}),
      }}
      {...props}
    ></div>
  )
}

const ForwardedRefSpinner = React.forwardRef(Spinner)

setDefaultProps(ForwardedRefSpinner, {
  size: '1rem',
  borderWidth: '2px',
  borderColor: 'unset',
})

export default ForwardedRefSpinner

export { ForwardedRefSpinner as Spinner }
