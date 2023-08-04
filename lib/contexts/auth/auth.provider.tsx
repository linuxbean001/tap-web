import {
  User as AuthInfoUser,
  WithAuthInfoProps,
  useLogoutFunction,
  withAuthInfo,
} from '@propelauth/react'
import Router from 'next/router'
import User from '../../domain/user'

import { isBrowser } from '../../utils'
import { AuthContext } from './auth.context'
import { fetchCurrentUser } from './auth.service'

type AuthProviderProps = {
  children: any
} & WithAuthInfoProps

type AuthUser = AuthInfoUser & User

/**
 * A provider for authentication that fetches data from the Tap3D API, and can be used to wrap page components.
 *
 * @example
 * <DataFetchProvider>
 *   <AuthProvider>
 *     <DashboardPage />
 *   </AuthProvider>
 * </DataFetchProvider>
 */
export const AuthProvider = withAuthInfo(
  ({ children, isLoggedIn, user }: AuthProviderProps) => {
    const logout = useLogoutFunction()

    if (isBrowser() && !isLoggedIn) {
      Router.push(process.env.NEXT_PUBLIC_AUTH_URL + '/login')
    }

    return isLoggedIn ? (
      <AuthContext.Provider
        value={{
          user: user as AuthUser,
          isLoggedIn,
          logout,
          fetchCurrentUser,
        }}
      >
        {children}
      </AuthContext.Provider>
    ) : null
  }
)
