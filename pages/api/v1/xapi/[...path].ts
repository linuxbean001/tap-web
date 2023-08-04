import type { NextApiRequest, NextApiResponse } from 'next'

import xAPI from '../../../../backend/services/xapi/xapi.controller'
import xAPIService from '../../../../backend/services/xapi/xapi.service'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const service: xAPIService = xAPIService.init()
  await new xAPI(service).dispatch(req, res)
}

export const config = {
  api: {
    bodyParser: false,
  },
}
