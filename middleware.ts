import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const env: Environment = process.env.ENV as Environment

  if (env !== 'local' && req.headers.get('x-forwarded-proto') !== 'https') {
    return NextResponse.redirect(
      `https://${req.headers.get('host')}${req.nextUrl.pathname}`,
      301
    )
  }
  return NextResponse.next()
}
