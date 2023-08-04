import type {
  Activity,
  Agent,
  Context,
  DocumentJson,
  Statement,
  Verb,
} from '@xapi/xapi'
import XAPI from '@xapi/xapi'
import axios, { AxiosInstance, AxiosResponse } from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'
import { HTTP_STATUS, Tap } from '../../../lib'
import consts from '../../data/constants'
import { getAppDomainUrl } from '../../utils'
import { getErrorMessage, InvalidRequestError } from '../../utils/errors'
import xAPIProcessor from './xapi.processor'

export default class xAPIService {
  xapi: XAPI
  prxy: AxiosInstance

  constructor(xapi: XAPI, prxy: AxiosInstance) {
    this.xapi = xapi
    this.prxy = prxy
  }

  static init(): xAPIService {
    const auth: string = XAPI.toBasicAuth(
      process.env.LRS_USERNAME,
      process.env.LRS_PASSWORD
    )
    const xapi: XAPI = new XAPI({ endpoint: process.env.LRS_ENDPOINT, auth })
    const prxy: AxiosInstance = axios.create({
      baseURL: process.env.LRS_ENDPOINT,
    })
    return new xAPIService(xapi, prxy)
  }

  async proxy(req: NextApiRequest, res: NextApiResponse, method: string) {
    const url: string = this.getPath(req)
    try {
      const resp: AxiosResponse = await this.prxy.request({
        method,
        url,
        auth: {
          username: process.env.LRS_USERNAME,
          password: process.env.LRS_PASSWORD,
        },
        data: req.body,
        timeout: 3000,
      })
      if (resp.status === HTTP_STATUS.NO_CONTENT) {
        res.status(resp.status).end()
      } else {
        res.status(resp.status).json(resp.data)
      }
    } catch (e) {
      console.error(`[xAPI.proxy.${method}] `, getErrorMessage(e))
      if (e.response) {
        res.status(e.response.status).json(e.response.data)
      } else {
        throw Error('An unknown exception occurred proxying xapi request.')
      }
    }
  }

  async process(req: NextApiRequest, res: NextApiResponse, method: string) {
    try {
      const url: string = this.getPath(req)
      if (url.match(/^\/statements/)) {
        const statements: Statement[] = this.parseStatements(req.body)
        if (statements.length) {
          await new xAPIProcessor().dispatch(statements)
        }
      }
    } catch (e) {
      console.error(`[xAPI.process.${method}] `, getErrorMessage(e))
    }
  }

  parseStatements(body: any): Statement[] {
    try {
      if (!body) throw new Error('Empty request body.')
      const stmts = Array.isArray(body) ? body : [body]
      stmts.forEach((stmt) =>
        z
          .object({
            actor: z.any(),
            verb: z.object({
              id: z.string(),
            }),
            object: z.any(),
            context: z.object({
              registration: z.string(),
            }),
          })
          .parse(stmt)
      )
      return stmts as Statement[]
    } catch (e) {
      console.error(
        `Failed to parse xAPI statements from body ${JSON.stringify(
          body
        )} with error: ${getErrorMessage(e)}`
      )
      return []
    }
  }

  /**
   * Reference: https://www.xapijs.dev/xapi-wrapper-library/state-resource#createstate
   * @param userId
   * @param activityId
   */
  async createState(
    user: Tap.User,
    activityId: string,
    activityAuId: string,
    registration: string,
    sessionId: string,
    launchMode: 'Normal' | 'Browse' | 'Review' = 'Normal',
    moveOn: 'Completed' | 'Passed' = 'Completed',
    returnUrl: string = `${getAppDomainUrl()}/courses`
  ) {
    try {
      const agent: Agent = xAPIService.getUserAgent(user)
      const state: DocumentJson = {
        contextTemplate: {
          extensions: {
            'https://w3id.org/xapi/cmi5/context/extensions/sessionid':
              sessionId,
          },
          grouping: {
            id: activityAuId,
          },
        },
        launchMode, // other options include: 'Browse', or 'Review'
        moveOn, // or 'Passed'
        returnURL: returnUrl,
      }

      return await this.xapi.createState({
        agent,
        activityId: xAPIService.getActivityIri(activityId),
        stateId: 'LMS.LaunchData',
        state,
        registration,
      })
    } catch (e) {
      console.error(e)
      throw new Error(
        `Failed to create xapi state document for user ${user.id} and activity ${activityId}`
      )
    }
  }

  /**
   * Reference: https://www.xapijs.dev/xapi-wrapper-library/agent-profile-resource#createagentprofile
   * @param userId
   * @param languagePreference
   * @param audioPreference
   */
  async createAgentProfile(
    user: Tap.User,
    languagePreference: string = 'en-US',
    audioPreference: string = 'off'
  ) {
    try {
      const agent: Agent = xAPIService.getUserAgent(user)
      const profile: DocumentJson = {
        languagePreference,
        audioPreference,
      }
      return await this.xapi.createAgentProfile({
        agent,
        profileId: 'cmi5LearnerPreferences',
        profile,
      })
    } catch (e) {
      console.error(e)
      throw new Error(`Failed to create agent profile for user: ${user.id}`)
    }
  }

  async sendLaunchedStatement(
    user: Tap.User,
    registration: string,
    activityId: string
  ): Promise<string[]> {
    try {
      const actor: Agent = xAPIService.getUserAgent(user)
      const object: Activity = {
        id: xAPIService.getActivityIri(activityId),
        objectType: 'Activity',
      }
      const verb: Verb = {
        id: consts.XAPI.VERBS.LAUNCHED,
        display: { 'en-US': 'launched' },
      }
      const context: Context = {
        registration,
      }
      const statement: Statement = {
        actor,
        verb,
        object,
        context,
      }

      const resp = await this.xapi.sendStatement({ statement })
      if (!resp.data || resp.data.length === 0) {
        throw new Error(
          `Failed to send xapi launch statement for user ${user.id} and activity ${activityId}`
        )
      }
      return resp.data
    } catch (e) {
      console.error(e)
      throw new Error(
        `Failed to send xapi launch statement for user ${user.id} and activity ${activityId}`
      )
    }
  }

  getPath(req: NextApiRequest): string {
    try {
      return req.url.split(/\/xapi/)[1]
    } catch (e) {
      throw new InvalidRequestError('Failed to parse xapi path.')
    }
  }

  static getUserAgent(user: Tap.User): Agent {
    return {
      objectType: 'Agent',
      name: `${user.firstName} ${user.lastName}`,
      account: {
        homePage: consts.TAP_HOMEPAGE,
        name: user.id,
      },
    }
  }

  static getActivityIri(activityId: string): string {
    return `${getAppDomainUrl()}/course-topic-activity/${activityId}`
  }
}
