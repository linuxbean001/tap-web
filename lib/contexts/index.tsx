import { AuthProvider as PropelAuthProvider } from '@propelauth/react'
import { AnalyticsProvider } from './analytics/analytics.provider'
import { AuthProvider } from './auth'
import { DataFetchProvider } from './data-fetch'

export * from './auth'
export * from './data-fetch'

export function withPageContexts<TProps>(
  Component: React.FC<TProps>,
  props?: TProps
) {
  return function PageComponent(pageProps: TProps) {
    return (
      <PropelAuthProvider authUrl={process.env.NEXT_PUBLIC_AUTH_URL || ''}>
        <DataFetchProvider provider={null}>
          <AuthProvider>
            <AnalyticsProvider>
              <Component {...pageProps} {...props} />
            </AnalyticsProvider>
          </AuthProvider>
        </DataFetchProvider>
      </PropelAuthProvider>
    )
  }
}
