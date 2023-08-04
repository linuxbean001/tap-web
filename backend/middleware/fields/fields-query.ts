import { createParamDecorator } from 'next-api-decorators'
import { Fields } from './fields'

export type FieldsQueryResult<T> = T extends string
  ? ('*' | T)[]
  : T extends {}
  ? ('*' | Fields<T>)[]
  : never

export const FieldsQuery = <TFields extends string>(
  allowedFields: TFields[] = []
) => {
  const decorator = createParamDecorator<FieldsQueryResult<TFields>>((req) => {
    const fields = req.query.fields
    if (!fields) {
      return ['*'] as FieldsQueryResult<TFields>
    }
    if (typeof fields === 'string' && fields.includes('*')) {
      return ['*'] as FieldsQueryResult<TFields>
    } else if (Array.isArray(fields) && fields.includes('*')) {
      return ['*'] as FieldsQueryResult<TFields>
    }

    return (
      (typeof fields === 'string'
        ? fields
            .replace(/[\[\]]/g, '')
            .split(',')
            .map((c) => c.replace(/["']/g, '').trim())
        : fields) as TFields[]
    ).filter((field) =>
      allowedFields.length ? allowedFields.includes(field) : true
    ) as FieldsQueryResult<TFields>
  })
  return decorator()
}
