import { AuthProviderForTesting } from '@propelauth/react'
import { Tap } from '../../domain'
import { setDefaultProps } from '../../utils'
import { AuthContext } from './auth.context'

type MockAuthProviderProps = {
  user?: Tap.User
  logout?: (redirectOnLogout: boolean) => Promise<void>
  children: any
}

/**
 * A provider for the AuthContext, to be used by tests and stories
 */
export const MockAuthProvider = ({
  user,
  logout,
  children,
}: MockAuthProviderProps) => {
  const authUser = {
    email: 'john.doe@tap3d.com',
    id: 'john.doe',
    firstName: 'John',
    lastName: 'Doe',
    role: Tap.User.Role.Member,
    ...user,
  }
  return (
    <AuthProviderForTesting
      userInformation={{
        user: {
          ...authUser,
          emailConfirmed: true,
          createdAt: new Date().getTime(),
          enabled: true,
          hasPassword: true,
          lastActiveAt: new Date().getTime(),
          locked: false,
          mfaEnabled: false,
          userId: authUser.id,
          legacyUserId: authUser.id,
          username: authUser.email,
        },
        orgMemberInfos: [],
        accessToken:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
      }}
      activeOrgFn={() => null}
      loading={false}
    >
      <AuthContext.Provider
        value={{
          user: authUser,
          isLoggedIn: true,
          logout,
          fetchCurrentUser: async () => authUser,
        }}
      >
        {children}
      </AuthContext.Provider>
    </AuthProviderForTesting>
  )
}

setDefaultProps(MockAuthProvider, {
  logout: async () => {},
})
