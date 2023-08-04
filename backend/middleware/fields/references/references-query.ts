import { createParamDecorator } from 'next-api-decorators'
import { ReferenceFields } from './references'

export type ReferencesQueryResult<TEntity extends {}> = Partial<
  Record<ReferenceFields<TEntity>, boolean>
>

/**
 * This allows the Request to have a `?references=[*]` query param
 */
export const ReferencesQuery = <TReferenceFields extends string>(
  allowedReferences: TReferenceFields[] = [],
  defaultReferences: TReferenceFields[] = []
) => {
  const decorator = createParamDecorator<Record<TReferenceFields, boolean>>(
    (req) => {
      const references = req.query.references
      const defaults = defaultReferences.length
        ? defaultReferences
        : allowedReferences

      const all = defaults.reduce(
        (dict, reference) => ({ ...dict, [reference]: true }),
        {} as Record<TReferenceFields, boolean>
      )
      if (!references) {
        return all
      }
      if (typeof references === 'string' && references === '*') {
        return all
      } else if (Array.isArray(references) && references.includes('*')) {
        return all
      }

      const splitReferences = (
        (typeof references === 'string'
          ? references
              .replace(/[\[\]]/g, '')
              .split(',')
              .map((c) => c.replace(/["']/g, '').trim())
          : references) as TReferenceFields[]
      ).filter(
        (reference) =>
          reference === '*' ||
          (allowedReferences.length
            ? allowedReferences.includes(reference)
            : true)
      )

      if ((splitReferences as (TReferenceFields | '*')[]).includes('*')) {
        return all
      }

      return splitReferences.reduce(
        (dict, reference) => ({ ...dict, [reference]: true }),
        {} as Record<TReferenceFields, boolean>
      )
    }
  )
  return decorator()
}
