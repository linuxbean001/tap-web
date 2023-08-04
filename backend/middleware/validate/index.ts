import { createParamDecorator } from 'next-api-decorators'
import { z } from 'zod'
import { ValidationError } from '../../utils/errors'

/**
 * A param validator for request body
 *
 * @example
 * export class TestController {
 *   createId(
 *     ＠Body()
 *     ＠Validate(z.object({ id: z.string() }))
 *       body: { id: string }
 *   ) {
 *     // ...
 *   }
 * }
 * @returns
 */
export const Validate = <TBody extends {}>(validator: z.ZodObject<TBody>) =>
  createParamDecorator<z.infer<z.ZodObject<TBody>>>((req) => {
    const body = validator.safeParse(req.body)
    if (body.success === false) {
      throw new ValidationError(body.error.issues)
    }
    return body.data
  })()
