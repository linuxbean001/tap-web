import * as Sentry from '@sentry/nextjs'

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN
const ENV = process.env.ENV || 'local'

Sentry.init({
  dsn: SENTRY_DSN || '',
  environment: ENV.toLowerCase(),
  enabled: ENV.toLowerCase() != 'local',
  tracesSampleRate: 1.0, // a number between 0 and 1, controlling the percentage chance a given transaction will be sent to Sentry.
})
