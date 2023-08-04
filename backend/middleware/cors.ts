import type { NextApiRequest, NextApiResponse } from 'next'
import { HTTP_STATUS } from '../../lib'

export async function setCorsHeaders(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const origins: RegExp[] = [/\.tap3d\.com$/, /localhost/]
  if (req.headers.origin) {
    const match: boolean = origins.some((o) => req.headers.origin.match(o))
    if (match) {
      res.setHeader('Access-Control-Allow-Origin', req.headers.origin)
      res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE')
      res.setHeader('Access-Control-Allow-Credentials', 'true')
      res.setHeader('Access-Control-Allow-Private-Network', 'true')
      res.setHeader(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization, x-csrf-token, x-experience-api-version, sentry-trace, baggage'
      )
      res.setHeader('Access-Control-Expose-Headers', '*, Authorization')
      res.setHeader('Vary', 'Origin')
    }

    if (
      req.method === 'OPTIONS' ||
      req.headers['access-control-request-method']
    ) {
      res.status(HTTP_STATUS.OK).end()
    }
  }
}
