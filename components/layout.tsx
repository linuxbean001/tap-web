import { useRedirectFunctions } from '@propelauth/react'
import Router, { useRouter } from 'next/router'
import { ReactNode, useContext } from 'react'
import { Tap } from '../lib'
import { AuthContext, useCurrentUser } from '../lib/contexts'
import { isBrowser, isRouterActive } from '../lib/utils'
import Footer from './footer'
import Nav from './nav'

const ROUTES = {
  courses: {
    name: 'Courses',
    href: '/courses',
  },
  dashboard: {
    name: 'Dashboard',
    href: '/dashboard',
  },
  myprogress: {
    name: 'My Progress',
    href: '/dashboard',
  },
}

const NAVIGATION = {
  [Tap.User.Role.Member]: [ROUTES.courses, ROUTES.myprogress],
  [Tap.User.Role.Admin]: [ROUTES.dashboard, ROUTES.courses],
  [Tap.User.Role.Owner]: [ROUTES.dashboard, ROUTES.courses],
}

type LayoutProps = {
  header?: ReactNode
  isLoggedIn?: boolean
  children?: ReactNode
}

function Layout({ header, children }: LayoutProps) {
  const route = useRouter()
  const { redirectToAccountPage } = useRedirectFunctions()
  const isDashboard = route?.pathname?.startsWith('/dashboard')
  const { isLoggedIn, logout } = useContext(AuthContext)
  const { user } = useCurrentUser()

  if (isBrowser() && !isLoggedIn) {
    Router.push(process.env.NEXT_PUBLIC_AUTH_URL + '/login')
  }

  if (!isLoggedIn || user?.role < 0) {
    return null
  }

  const links = NAVIGATION[user?.role]?.map((link) => ({
    href: link.href,
    text: link.name,
  }))

  return (
    <div
      className={`min-h-screen flex flex-col ${
        isDashboard ? 'bg-gray-1' : ''
      } `}
    >
      <Nav
        className="mx-auto max-w-7xl"
        active={isRouterActive() ? Router.pathname : '/'}
        isLoggedIn={isLoggedIn}
        user={user}
        links={links}
        logout={() => logout(true)}
        redirectToAccountPage={() => redirectToAccountPage()}
      />
      <div className="flex-1 py-10">
        {header}
        <main className="font-body p-5 md:p-0">
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-20">{children}</div>
        </main>
      </div>
      <Footer />
    </div>
  )
}

export default Layout
