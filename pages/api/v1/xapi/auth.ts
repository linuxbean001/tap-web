import type { NextApiRequest, NextApiResponse } from 'next'
import xAPIAuthorizer from '../../../../backend/services/xapi/xapi.authorizer'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await new xAPIAuthorizer().dispatch(req, res)
}
