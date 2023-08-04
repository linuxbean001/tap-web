import CryptoJS from 'crypto-js'
import { DateTime } from 'luxon'
import type { NextApiRequest, NextApiResponse } from 'next'
import {
  createMiddlewareDecorator,
  createParamDecorator,
} from 'next-api-decorators'
import { HTTP_STATUS, Tap, assert } from '../../lib'
import PropelAuth from '../services/propel/propel.service'
import UserService from '../services/user/user.service'
import { AuthorizationError, getErrorMessage } from '../utils/errors'

export interface NextApiRequestAuthed extends NextApiRequest {
  user: {
    userId: string
  }
}

export async function isAuthorizedPropel(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await PropelAuth().requireUser(req, res, (result: any) => {})
  if (res.statusCode === HTTP_STATUS.UNAUTHORIZED) {
    throw new AuthorizationError()
  }
}

export const AuthGuard = createMiddlewareDecorator(isAuthorizedPropel)

export const AuthUser = createParamDecorator<Promise<Tap.User>>(
  async (req: NextApiRequestAuthed) => {
    const userId = req.user.userId
    const user = await new UserService().getUserById(userId)
    return user
  }
)

export const AuthUserId = createParamDecorator<string>(
  (req: NextApiRequestAuthed) => {
    return req.user.userId
  }
)

export async function isAuthorizedCustom(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    assert(req.headers.authorization, 'Missing authorization header.')

    // parse auth token
    const authToken = req.headers.authorization.split(' ')[1]
    const bytes = CryptoJS.AES.decrypt(
      authToken,
      process.env.PROPEL_AUTH_API_KEY
    )
    const token = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
    const issueDate: DateTime = DateTime.fromISO(token.issued)
    const valid: boolean = issueDate.diffNow('hours').toObject().hours < 24

    // verify
    assert(valid, 'Auth token has expired.')
    assert(
      await PropelAuth().fetchUserMetadataByUserId(token.id, false),
      'Id verification failed.'
    )
  } catch (e) {
    console.error('[Auth.custom] ', getErrorMessage(e))
    throw new AuthorizationError()
  }
}
