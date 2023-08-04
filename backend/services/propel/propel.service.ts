import { initAuth } from '@propelauth/express'

let _propelAuth: ReturnType<typeof initAuth> = null

export const PropelAuth = () => {
  if (!_propelAuth) {
    _propelAuth = initAuth({
      authUrl: process.env.NEXT_PUBLIC_AUTH_URL || '',
      apiKey: process.env.PROPEL_AUTH_API_KEY || '',
      manualTokenVerificationMetadata: {
        verifierKey: process.env.PROPEL_AUTH_VERIFIER_KEY || '',
        issuer: process.env.NEXT_PUBLIC_AUTH_URL || '',
      },
    })
  }
  return _propelAuth
}

export default PropelAuth
