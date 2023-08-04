import * as Sentry from '@sentry/nextjs'
import { NextApiRequest, NextApiResponse } from 'next'
import { ZodIssue } from 'zod'

import { HTTP_STATUS } from '../../lib'

export interface ErrorResp {
  error: {
    message: string
    code?: number
  }
}

export class ValidationError extends Error {
  constructor(errors: ZodIssue[]) {
    super(
      `Request Validation Error: ${errors
        .map((e) => `${e.path}: ${e.message}`)
        .join(', ')}`
    )
  }
}

export class AuthorizationError extends Error {
  constructor() {
    super()
  }
}

export class InvalidRequestError extends Error {
  constructor(message: string) {
    super(message || 'Invalid or malformed request.')
  }
}

export class UnsupportedHTTPMethodError extends InvalidRequestError {
  constructor() {
    super('Unsupported HTTP method.')
  }
}

export function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message
  return String(error)
}

export function getErrorResp(message: string, code = -1): ErrorResp {
  return {
    error: {
      ...{ message: message || 'Unknown' },
      code,
    },
  }
}

export function exceptionHandler(
  e: unknown,
  req: NextApiRequest,
  res: NextApiResponse
) {
  Sentry.captureException(e)
  const message: string = getErrorMessage(e) || 'An unknown exception occured.'
  if (e instanceof AuthorizationError) {
    res.status(HTTP_STATUS.UNAUTHORIZED).json(getErrorResp('Unauthorized'))
  } else if (e instanceof InvalidRequestError || e instanceof ValidationError) {
    res.status(HTTP_STATUS.BAD_REQUEST).json(getErrorResp(getErrorMessage(e)))
  } else if (message.includes('NotFoundError')) {
    res.status(HTTP_STATUS.NOT_FOUND).json(getErrorResp(message))
  } else {
    console.error(message)
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(getErrorResp(message))
  }
}
