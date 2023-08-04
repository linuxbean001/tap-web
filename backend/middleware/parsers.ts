import type { NextApiRequest, NextApiResponse } from 'next'
import getRawBody from 'raw-body'

import { InvalidRequestError } from '../utils/errors'

export async function parseRawRequestBody(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (
    req.headers['content-type'] &&
    req.headers['content-type'].toLowerCase() === 'application/json'
  ) {
    try {
      const buffer = await getRawBody(req)
      req.body = JSON.parse(buffer.toString())
    } catch (e) {
      throw new InvalidRequestError('Failed to parse JSON body.')
    }
  } else {
    req.body = {}
  }
}
