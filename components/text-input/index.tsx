import classNames from 'classnames'
import React, { useState } from 'react'
import { setDefaultProps } from '../../lib/utils'

export type TextInputProps = {
  type?: string
  className?: string | Record<string, boolean> | string[]
  valid?: boolean | null
  disabled?: boolean
  required?: boolean
  value?: string
} & React.HTMLAttributes<HTMLInputElement>

function TextInput(
  { className, valid, disabled, onChange, value, ...props }: TextInputProps,
  ref: React.ForwardedRef<HTMLInputElement>
) {
  const [isActive, setIsActive] = useState(false)
  const activeClasses = classNames('border-gray-3', {
    'hover:border-gray-4 focus:border-primary-5': !props['aria-readonly'],
  })
  const invalidClasses = 'border-red-5 focus:border-red-5 hover:border-red-5'
  const disabledClasses = 'border-dark-tertiary bg-gray-3 cursor-not-allowed'

  const hasValidation = () => valid !== undefined && valid !== null
  const validationStyle = () => {
    if (hasValidation()) {
      return valid ? (isActive ? '' : activeClasses) : invalidClasses
    }
  }

  const textboxClassName = classNames(
    className,
    ['border rounded-md p-2 w-full shadow-sm', 'focus:outline-none'],
    {
      'caret-primary-5': !props['aria-readonly'],
      'caret-transparent': props['aria-readonly'],
      'border-gray-3': !isActive && (!hasValidation() || valid),
    },
    // don't apply activeStyle if has valid or disabled
    isActive && (hasValidation() ? valid : true) && !disabled && activeClasses,
    // don't apply disabledStyle if has valid
    !hasValidation() && disabled && disabledClasses,
    validationStyle()
  )
  return (
    <input
      {...props}
      ref={ref}
      className={textboxClassName}
      disabled={disabled}
      value={value}
      onChange={(e) => {
        typeof onChange === 'function' && onChange(e)
        setIsActive(false)
      }}
      onFocus={() => setIsActive(true)}
    />
  )
}

const ForwardedRefTextInput = React.forwardRef(TextInput)

setDefaultProps(ForwardedRefTextInput, {
  type: 'text',
})

export default ForwardedRefTextInput

export { ForwardedRefTextInput as TextInput }
