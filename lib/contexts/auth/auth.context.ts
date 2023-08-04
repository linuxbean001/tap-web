import React from 'react'

import { Tap } from '../../domain'

type AuthContextProps = {
  isLoggedIn: boolean
  user: Tap.User
  logout: (redirectOnLogout: boolean) => Promise<void>
  fetchCurrentUser: () => Promise<Tap.User>
}

export const AuthContext = React.createContext<AuthContextProps>({
  isLoggedIn: false,
  user: null,
  logout: async () => {},
  fetchCurrentUser: async () => null,
})
