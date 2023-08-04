const { withSentryConfig } = require('@sentry/nextjs')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  eslint: {
    dirs: ['pages', 'components', 'lib'],
  },
  images: {
    domains: [
      'images.unsplash.com',
      'cdn.tap3d.com',
      'staging.cdn.tap3d.com',
      'dev.cdn.tap3d.com',
    ],
  },
  sentry: {
    hideSourceMaps: true,
    excludeServerRoutes: [/\/xapi/],
  },
  async headers() {
    return [
      {
        source: '/(.*?)',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
        ],
      },
    ]
  },
}

const sentryWebpackPluginOptions = {
  silent: true, // suppresses all logs
  // dryRun: true, // uncomment when running production build locally
}

module.exports = withSentryConfig(nextConfig, sentryWebpackPluginOptions)
