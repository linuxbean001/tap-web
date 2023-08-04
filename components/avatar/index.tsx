import classNames from 'classnames'
import Image from 'next/image'
import { forwardRef, HTMLAttributes, ReactNode } from 'react'

type OneOf<TValues, TLiteralType extends string | number | symbol = string> =
  | TValues
  | (TLiteralType & { invalid?: never })

export type AvatarTheme = OneOf<'primary' | 'gray' | 'white'>
export type AvatarThemeIntensity = OneOf<'light' | 'default' | 'dark'>
export type Sizes = OneOf<'lg' | 'md' | 'sm'>

export type Props = Partial<{
  className: string
  theme: AvatarTheme
  size: Sizes
  src: string
  intensity: AvatarThemeIntensity
  children: ReactNode
}> &
  HTMLAttributes<HTMLDivElement>

const Avatar = forwardRef<HTMLDivElement, Props>(function Avatar(
  {
    children,
    className,
    theme = 'white',
    size = 'sm',
    src,
    intensity = 'default',
    ...rest
  },
  ref
) {
  const _className = classNames(
    'avatar',
    {
      ...(theme === 'white'
        ? {
            'text-dark-primary': true,
            border: true,
            'border-gray-3': true,
          }
        : {}),
      ...(theme === 'gray'
        ? {
            'text-gray-secondary': true,
            'bg-gray-9 text-gray-tertiary': intensity === 'light',
            'bg-gray-4': intensity === 'default',
            'bg-gray-10': intensity === 'dark',
          }
        : {}),
      ...(theme === 'primary'
        ? {
            'text-dark-primary': true,
            'bg-primary-6 text-light-secondary': intensity === 'light',
            'bg-primary-3': intensity === 'default',
            'bg-primary-1 border-gray-3 border': intensity === 'dark',
          }
        : {}),
      [`${
        size === 'md'
          ? 'w-12 h-12'
          : size === 'sm'
          ? 'w-8 h-8'
          : size === 'lg'
          ? 'w-20 h-20'
          : ''
      }`]: size,
    },
    className
  )

  return (
    <div className={_className} {...rest} ref={ref}>
      {src ? (
        <Image src={src} className="avatar-img" alt="Avatar image" />
      ) : (
        children
      )}
    </div>
  )
})

export default Avatar
