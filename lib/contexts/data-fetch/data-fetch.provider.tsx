import React from 'react'
import { SWRConfig } from 'swr'

import { setDefaultProps } from '../../utils'
import { DataFetchContext } from './data-fetch.context'
import { getFetchFunction } from './data-fetch.function'
import { Api, getApiFallbackData } from './models'

type DataFetchProviderProps = {
  children?: any
  fallback?: Partial<Api.Get>
  provider?: () => Map<any, any>
} & React.HTMLAttributes<HTMLDivElement>

/**
 * The `DataFetchProvider` provides a DataFetchContext and SWRConfig, capable of fetching data from the Tap3D API.\
 *
 * It takes a `fallback` prop, which lets you stub out requests for any Tap3D endpoint, as long as it is registered
 * in the [ApiModel](./models/index.ts)
 *
 * @example
 * <DataFetchProvider fallback={{ "/user/me": { email: "john.doe@tap3d.com" } }}>
 *   <Dashboard />
 * </DataFetchProvider>
 *
 * @example
 * <DataFetchProvider fallback={{ "/courses": [{ title: "Electronics" }] }}>
 *   <Courses />
 * </DataFetchProvider>
 */
export const DataFetchProvider = ({
  children,
  fallback,
  provider,
}: DataFetchProviderProps) => {
  const cache = () => provider
  return (
    <DataFetchContext.Provider
      value={{
        fallback,
      }}
    >
      <SWRConfig
        value={{
          refreshInterval: 300000,
          fetcher: getFetchFunction(),
          fallback,
          ...(provider ? { provider: cache() } : {}),
        }}
      >
        {children}
      </SWRConfig>
    </DataFetchContext.Provider>
  )
}

setDefaultProps(DataFetchProvider, {
  fallback: getApiFallbackData(),
  provider: () => new Map(),
})
