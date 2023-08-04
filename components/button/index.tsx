import classNames from 'classnames'
import React from 'react'
import { setDefaultProps } from '../../lib/utils'

type OneOf<TValues, TLiteralType extends string | number | symbol = string> =
  | TValues
  | (TLiteralType & { invalid?: never })
type ButtonTheme = OneOf<'yellow' | 'gray'>
type ButtonThemeIntensity = OneOf<'light' | 'default' | 'dark'>

type ButtonProps = {
  as?: string | React.FC<any>
  children: any
  className?: string | Record<string, boolean> | string[]
  /** defaults to "yellow" */
  theme?: ButtonTheme
  /** defaults to "default" */
  intensity?: ButtonThemeIntensity
  disabled?: boolean
} & React.HTMLAttributes<HTMLElement>

function Button(
  {
    as,
    children,
    className,
    theme,
    intensity,
    disabled,
    onClick,
    ...props
  }: ButtonProps,
  ref: React.ForwardedRef<Element>
) {
  const Component = as || 'button'
  const btnClassName = classNames(className, 'rounded font-bold', {
    'cursor-not-allowed': disabled,
    'hover:scale-105': !disabled,
    ...(theme === 'blue'
      ? {
          ...(disabled
            ? {
                'bg-blue-4 text-primary-2': true,
              }
            : {
                'text-light-primary': true,
                'bg-blue-0': intensity === 'default',
                'bg-blue-4': intensity === 'light',
                // 'bg-blue-4': intensity === 'dark',
              }),
        }
      : {}),
    ...(theme === 'gray'
      ? {
          ...(disabled
            ? {
                'bg-gray-9 text-gray-tertiary': true,
              }
            : {
                'text-gray-secondary': true,
                'bg-gray-9 text-gray-tertiary': intensity === 'light',
                'bg-gray-4': intensity === 'default',
                'bg-gray-10': intensity === 'dark',
              }),
        }
      : {}),
  })
  return (
    <Component
      {...props}
      ref={ref}
      className={btnClassName}
      disabled={disabled}
      onClick={(e: React.MouseEvent<HTMLElement>) => {
        e.stopPropagation()
        typeof onClick === 'function' && onClick(e)
      }}
    >
      {children}
    </Component>
  )
}

const ForwardedRefButton = React.forwardRef(Button)

setDefaultProps(ForwardedRefButton, {
  as: 'button',
  theme: 'yellow',
  intensity: 'default',
})

export default ForwardedRefButton

export { ForwardedRefButton as Button }
