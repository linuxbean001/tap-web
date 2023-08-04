import CryptoJS from 'crypto-js'
import { DateTime } from 'luxon'

import type { NextApiRequest, NextApiResponse } from 'next'
import { assert, HTTP_STATUS } from '../../../lib'
import { setCorsHeaders } from '../../middleware'
import PropelAuth from '../propel/propel.service'
import Controller from './base.controller'

export default class xAPIAuthorizer extends Controller {
  constructor() {
    super()
    this.middleware = [setCorsHeaders]
  }

  async post(req: NextApiRequest, res: NextApiResponse) {
    const userId = assert(req.query.id, 'Missing id query param.') as string
    assert(
      await PropelAuth().fetchUserMetadataByUserId(userId, false),
      'Id verification failed.'
    )
    const authToken = CryptoJS.AES.encrypt(
      JSON.stringify({
        id: userId,
        issued: DateTime.utc().toISO(),
      }),
      process.env.PROPEL_AUTH_API_KEY
    ).toString()

    res.status(HTTP_STATUS.OK).json({
      'auth-token': authToken,
    })
  }
}
