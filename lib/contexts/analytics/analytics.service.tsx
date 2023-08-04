import { AnalyticsBrowser } from '@segment/analytics-next'

/**
 * This is a wrapper around the Segment Analytics SDK.
 * It is used to initialize the SDK and to identify the user.
 *
 * References:
 *  - https://github.com/segmentio/analytics-next
 *  - https://segment.com/docs/connections/spec/
 *  - https://segment.com/docs/connections/sources/catalog/libraries/website/javascript/
 */

export default class AnalyticsService {
  analytics: AnalyticsBrowser | undefined

  constructor() {
    const writeKey = process.env.NEXT_PUBLIC_SEGMEMT_WRITE_KEY
    if (writeKey) {
      this.analytics = AnalyticsBrowser.load({
        writeKey,
      })
    }
  }

  identify(userId: string, traits: Record<string, any> = {}) {
    if (this.analytics) {
      this.analytics.identify(userId, traits)
    }
  }

  group(groupId: string, traits: Record<string, any> = {}) {
    if (this.analytics) {
      this.analytics.group(groupId, traits)
    }
  }

  page(pageName: string, properties: Record<string, any> = {}) {
    if (this.analytics) {
      this.analytics.page(pageName, properties)
    }
  }

  track(eventName: string, properties: Record<string, any> = {}) {
    if (this.analytics) {
      this.analytics.track(eventName, properties)
    }
  }

  reset() {
    if (this.analytics) {
      this.analytics.reset()
    }
  }
}
