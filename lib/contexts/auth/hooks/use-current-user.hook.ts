import { useAuthInfo } from '@propelauth/react'
import { useContext } from 'react'

import { setFetchFunction, useDataFetch } from '../../data-fetch'
import { AuthContext } from '../auth.context'

export function useCurrentUser() {
  const auth = useAuthInfo()

  const { fetchCurrentUser } = useContext(AuthContext)
  const accessToken = auth.loading === true ? null : auth.accessToken
  if (accessToken) {
    setFetchFunction((input, init) =>
      fetch(input, {
        ...init,
        headers: {
          ...init?.headers,
          Authorization: `Bearer ${accessToken}`,
        },
      })
    )
  }
  const { user } = useContext(AuthContext)
  const res = useDataFetch('/user/me', {
    fetcher: fetchCurrentUser,
  })

  return {
    ...res,
    ...(auth.loading === true ? {} : { accessToken: auth.accessToken }),
    ...(res.data ? { user: res.data } : { user }),
  }
}
