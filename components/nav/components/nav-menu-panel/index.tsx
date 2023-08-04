import { Disclosure } from '@headlessui/react'
import classNames from 'classnames/dedupe'
import React from 'react'

type NavMenuPanelProps = {
  children?: any
  className?: any
  isActive: (href: string) => boolean
  links: readonly { text: string; href: string }[]
  user: { name: string; email: string } | null
  isLoggedIn: boolean
  onClickLogout: () => void
  onClickUpdateUser: () => void
} & Omit<React.HTMLAttributes<HTMLDivElement>, 'className'>

function NavMenuPanel(
  {
    children,
    className,
    isActive,
    links,
    user,
    isLoggedIn,
    onClickLogout,
    onClickUpdateUser,
    ...props
  }: NavMenuPanelProps,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  return (
    <Disclosure.Panel
      className={classNames('sm:hidden', className)}
      {...props}
      ref={ref}
    >
      <div className="space-y-1 pt-2 pb-3">
        {links?.map((link) => (
          <Disclosure.Button
            key={link.text}
            as="a"
            href={link.href}
            className={classNames(
              'block pl-3 pr-4 py-2 border-l-4 text-base font-medium',
              {
                'bg-blue-0 border-blue-0 text-white': isActive(link.href),
                'border-transparent text-gray-6 hover:bg-gray-1 hover:border-gray-3 hover:text-gray-8':
                  !isActive(link.href),
              }
            )}
            aria-current={isActive(link.href) ? 'page' : undefined}
          >
            {link.text}
          </Disclosure.Button>
        ))}
      </div>
      <div className="border-t border-gray-2 pt-4 pb-3">
        {user ? (
          <div className="flex items-center px-4">
            <div className="">
              <div className="text-base font-medium text-gray-8">
                {user.name}
              </div>
              <div className="text-sm font-medium text-gray-5">
                {user.email}
              </div>
            </div>
          </div>
        ) : null}
        <div className="mt-3 space-y-1">
          {isLoggedIn ? (
            <Disclosure.Button
              key={'Update User'}
              as="a"
              onClick={() => onClickUpdateUser()}
              className="block px-4 py-2 text-base font-medium text-gray-5 hover:bg-gray-1 hover:text-gray-8"
            >
              Update User Profile
            </Disclosure.Button>
          ) : null}
        </div>
        <div className="mt-3 space-y-1">
          {isLoggedIn ? (
            <Disclosure.Button
              key={'Log Out'}
              as="a"
              onClick={onClickLogout}
              className="block px-4 py-2 text-base font-medium text-gray-5 hover:bg-gray-1 hover:text-gray-8"
            >
              Log Out
            </Disclosure.Button>
          ) : null}
        </div>
      </div>
    </Disclosure.Panel>
  )
}

const ForwardedRefNavMenuPanel = React.forwardRef(NavMenuPanel)

export default ForwardedRefNavMenuPanel

export { ForwardedRefNavMenuPanel as NavMenuPanel }
