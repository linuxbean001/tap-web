import type { NextApiRequest, NextApiResponse } from 'next'
import { getErrorResp } from '../../backend/utils/errors'
import { HTTP_STATUS } from '../../lib'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.status(HTTP_STATUS.NOT_FOUND).json(getErrorResp('No matching route.'))
}
