import { createContext, useContext, useEffect } from 'react'
import { fmtRole } from '../../domain/user'
import { useCurrentUser } from '../auth'
import AnalyticsService from './analytics.service'

const analyticsService = new AnalyticsService()

const AnalyticsContext = createContext<{
  analytics: AnalyticsService
}>({
  analytics: analyticsService,
})

export const AnalyticsProvider = ({ children }) => {
  const { user } = useCurrentUser()

  useEffect(() => {
    if (user) {
      analyticsService.identify(user.id, {
        env: process.env.NEXT_PUBLIC_ENV || '',
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        ...(user.role && { role: fmtRole(user.role) }),
        ...(user.organization && { org: user.organization?.name || 'unknown' }),
      })
      if (user.organization) {
        analyticsService.group(user.organization.id, {
          name: user.organization.name,
        })
      }
    }
  }, [user])

  return (
    <AnalyticsContext.Provider value={{ analytics: analyticsService }}>
      {children}
    </AnalyticsContext.Provider>
  )
}

export const useAnalytics = (): {
  analytics: AnalyticsService
} => {
  return useContext(AnalyticsContext)
}
