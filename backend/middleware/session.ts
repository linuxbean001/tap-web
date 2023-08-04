import cookie from 'cookie'
import type { NextApiResponse } from 'next'
import { getRootDomain } from '../utils'

export interface Session {
  userId: string
}

export function setSessionCookies(res: NextApiResponse, userId: string) {
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies
  res.setHeader(
    'Set-Cookie',
    cookie.serialize('session', JSON.stringify({ userId }), {
      httpOnly: true,
      secure: true,
      maxAge: 60 * 60 * 24 * 7, // 1 week
      sameSite: 'None',
      path: '/',
      domain: process.env.ENV === 'local' ? 'localhost' : getRootDomain(),
    })
  )
}
