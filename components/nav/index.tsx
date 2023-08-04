import { Disclosure } from '@headlessui/react'
import classNames from 'classnames/dedupe'
import Image from 'next/image'
import React, { useCallback } from 'react'
import { useAnalytics } from '../../lib/contexts/analytics/analytics.provider'
import { setDefaultProps } from '../../lib/utils'
import { Link, NavDropdownButton, NavMenuPanel } from './components'
import { NavMenuButton } from './components/nav-menu-button'
import { NavUser, getUsername } from './utils'

type NavProps<TLinks, THref> = {
  children?: any
  className?: any
  links?: TLinks
  active: THref
  isLoggedIn?: boolean
  user: NavUser | null
  logout: () => void
  redirectToAccountPage: () => void
} & React.HTMLAttributes<HTMLElement>

function Nav<TLinks extends readonly { text: string; href: string }[]>(
  {
    children,
    className,
    links,
    active,
    isLoggedIn,
    user,
    logout,
    redirectToAccountPage,
    ...props
  }: NavProps<
    TLinks,
    TLinks extends readonly { text: string; href: infer THref extends string }[]
      ? THref
      : never
  >,
  ref: React.ForwardedRef<HTMLElement>
) {
  const { analytics } = useAnalytics()

  const onClickUpdateUser = useCallback(() => {
    analytics.track('Clicked Update User Profile Menu Item')
    redirectToAccountPage()
  }, [redirectToAccountPage, analytics])

  const onClickLogout = useCallback(() => {
    analytics.track('Clicked Logout Menu Item')
    analytics.reset()
    logout()
  }, [logout, analytics])

  return (
    <Disclosure
      as="nav"
      {...props}
      ref={ref}
      className={classNames(
        'w-full border-b border-gray-2 text-blue-gray font-body text-md md:text-sm font-regular underline-offset-2',

        className
      )}
    >
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between">
              <div className="flex">
                <div className="flex flex-shrink-0 items-center">
                  <Image
                    className="w-8 h-8"
                    width={32}
                    height={32}
                    src="/tap_reskin.svg"
                    alt="Tap3d"
                  />
                </div>
                <div className="hidden sm:-my-px sm:ml-6 sm:flex font-bold">
                  {links?.map((item) => (
                    <Link
                      href={item.href}
                      key={item.text}
                      className={classNames(
                        'inline-flex items-center p-8 border-b-2 text-h-xs font-medium',
                        {
                          'border-blue-0 text-dark-primary':
                            active === item.href,
                          'border-transparent hover:border-gray-3 text-dark-tertiary':
                            active !== item.href,
                        }
                      )}
                      aria-current={item.href === active ? 'page' : undefined}
                    >
                      {item.text}
                    </Link>
                  ))}
                </div>
              </div>
              {user ? (
                <NavDropdownButton
                  onClickUpdateUser={onClickUpdateUser}
                  onClickLogout={onClickLogout}
                >
                  {getUsername(user)}
                </NavDropdownButton>
              ) : null}
              <NavMenuButton open={open} />
            </div>
          </div>
          {user ? (
            <NavMenuPanel
              isLoggedIn={isLoggedIn || false}
              user={{
                name: getUsername(user),
                email: user?.email,
              }}
              isActive={(href) => href === active}
              links={Array.isArray(links) ? links : []}
              onClickLogout={onClickLogout}
              onClickUpdateUser={onClickUpdateUser}
            />
          ) : null}
        </>
      )}
    </Disclosure>
  )
}

const ForwardedRefNav = React.forwardRef(Nav)

setDefaultProps(ForwardedRefNav, {
  links: [
    {
      text: 'Courses',
      href: '/courses',
    },
    {
      text: 'My Progress',
      href: '/my-progress',
    },
  ] as const,
})

export default ForwardedRefNav

export * from './components'
export { ForwardedRefNav as Nav }
