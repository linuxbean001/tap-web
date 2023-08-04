import type { NextApiRequest, NextApiResponse } from 'next'
import { HTTP_STATUS } from '../../../lib'
import { isAuthorizedPropel, setCorsHeaders } from '../../middleware'
import {
  exceptionHandler,
  getErrorResp,
  UnsupportedHTTPMethodError,
} from '../../utils/errors'

export default class Controller {
  middleware: ((
    req: NextApiRequest,
    res: NextApiResponse<any>
  ) => Promise<void>)[] = [setCorsHeaders, isAuthorizedPropel]

  async runMiddleware(req: NextApiRequest, res: NextApiResponse) {
    for (let idx in this.middleware) {
      await this.middleware[idx](req, res)
      if (res.headersSent || res.writableEnded) return
    }
  }
  async dispatch(req: NextApiRequest, res: NextApiResponse) {
    try {
      await this.runMiddleware(req, res)
      if (res.headersSent || res.writableEnded) return

      switch (req.method) {
        case 'GET':
          await this.get(req, res)
          break
        case 'POST':
          await this.post(req, res)
          break
        case 'PUT':
          await this.put(req, res)
          break
        case 'PATCH':
          await this.patch(req, res)
          break
        case 'DELETE':
          await this.delete(req, res)
          break
        default:
          this.unknown(res)
      }
    } catch (e) {
      exceptionHandler(e, req, res)
    }
  }

  async get(req: NextApiRequest, res: NextApiResponse) {
    throw new UnsupportedHTTPMethodError()
  }
  async post(req: NextApiRequest, res: NextApiResponse) {
    throw new UnsupportedHTTPMethodError()
  }
  async put(req: NextApiRequest, res: NextApiResponse) {
    throw new UnsupportedHTTPMethodError()
  }
  async patch(req: NextApiRequest, res: NextApiResponse) {
    throw new UnsupportedHTTPMethodError()
  }
  async delete(req: NextApiRequest, res: NextApiResponse) {
    throw new UnsupportedHTTPMethodError()
  }

  unknown(res: NextApiResponse) {
    res
      .status(HTTP_STATUS.BAD_REQUEST)
      .json(getErrorResp('Invalid http method.'))
  }
}
