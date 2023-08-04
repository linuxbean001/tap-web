import type { NextApiRequest, NextApiResponse } from 'next'
import {
  isAuthorizedCustom,
  parseRawRequestBody,
  setCorsHeaders,
} from '../../middleware'
import Controller from './base.controller'
import xAPIService from './xapi.service'

export default class xAPIController extends Controller {
  xapi: xAPIService

  constructor(service: xAPIService) {
    super()
    this.xapi = service
    this.middleware = [setCorsHeaders, isAuthorizedCustom, parseRawRequestBody]
  }

  async get(req: NextApiRequest, res: NextApiResponse) {
    await this.xapi.process(req, res, 'GET')
    await this.xapi.proxy(req, res, 'GET')
  }

  async post(req: NextApiRequest, res: NextApiResponse) {
    await this.xapi.process(req, res, 'POST')
    await this.xapi.proxy(req, res, 'POST')
  }

  async put(req: NextApiRequest, res: NextApiResponse) {
    await this.xapi.process(req, res, 'PUT')
    await this.xapi.proxy(req, res, 'PUT')
  }

  async delete(req: NextApiRequest, res: NextApiResponse) {
    await this.xapi.process(req, res, 'DELETE')
    await this.xapi.proxy(req, res, 'DELETE')
  }
}
