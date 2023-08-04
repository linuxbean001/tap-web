import { Disclosure } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import classNames from 'classnames/dedupe'
import React from 'react'

type NavMenuButtonProps = {
  children?: any
  className?: any
  open: boolean
} & Omit<React.HTMLAttributes<HTMLDivElement>, 'className'>

function NavMenuButton(
  { children, className, open, ...props }: NavMenuButtonProps,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  return (
    <div
      {...props}
      className={classNames('-mr-2 flex items-center sm:hidden', className)}
      ref={ref}
    >
      {/* Mobile menu button */}
      <Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-4 hover:bg-gray-1 hover:text-gray-5">
        {open ? (
          <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
        ) : (
          <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
        )}
      </Disclosure.Button>
    </div>
  )
}

const ForwardedRefNavMenuButton = React.forwardRef(NavMenuButton)

export default ForwardedRefNavMenuButton

export { ForwardedRefNavMenuButton as NavMenuButton }
