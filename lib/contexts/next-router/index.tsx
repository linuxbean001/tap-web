import { RouterContext } from 'next/dist/shared/lib/router-context'
import { setDefaultProps } from '../../utils'

type NextRouterProviderProps<TQuery> = {
  children: any
  path: string
  asPath?: string
  query?: TQuery
}

export function NextRouterProvider<TQuery extends {}>({
  children,
  path,
  asPath,
  query,
}: NextRouterProviderProps<TQuery>) {
  return (
    <RouterContext.Provider
      value={
        {
          pathname: path,
          route: path,
          query,
          asPath: asPath || path,
        } as any
      }
    >
      {children}
    </RouterContext.Provider>
  )
}

setDefaultProps(NextRouterProvider, {
  query: {},
})
