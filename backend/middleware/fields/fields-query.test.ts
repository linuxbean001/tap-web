import { NextApiRequest } from 'next'
import { PARAMETER_TOKEN } from 'next-api-decorators/dist/decorators'
import { FieldsQuery } from './fields-query'

describe('@FieldsQuery()', () => {
  it('should accept empty allowedFields', async () => {
    class TestController {
      public index(@FieldsQuery([]) fields: string[]) {}
    }
    const [{ fn: getValue }] = Reflect.getMetadata(
      PARAMETER_TOKEN,
      TestController,
      'index'
    ) as [{ fn: (req: Partial<NextApiRequest>) => string[] }]
    const fields = getValue({
      query: {
        fields: '',
      },
    })
    expect(fields).toEqual(['*'])
  })

  it('should allow [a, b] only', async () => {
    const fieldsQueryValues = [
      'a,b',
      '[a,b]',
      '[a, b]',
      "['a', 'b']",
      '["a","b"]',
      '["a", "b"]',
      ['a', 'b'],
    ]
    for (let fieldsQueryValue of fieldsQueryValues) {
      class TestController {
        public index(@FieldsQuery(['a', 'b', 'c']) fields: string[]) {}
      }
      const [{ fn: getValue }] = Reflect.getMetadata(
        PARAMETER_TOKEN,
        TestController,
        'index'
      ) as [{ fn: (req: Partial<NextApiRequest>) => string[] }]
      const fields = getValue({
        query: {
          fields: fieldsQueryValue,
        },
      })
      expect(fields).toEqual(['a', 'b'])
    }
  })

  it('should allow [a, b, c]', async () => {
    const fieldsQueryValues = ['a,b,c', 'a, b, c', 'a, b, c, d']
    for (let fieldsQueryValue of fieldsQueryValues) {
      class TestController {
        public index(@FieldsQuery(['a', 'b', 'c']) fields: string[]) {}
      }
      const [{ fn: getValue }] = Reflect.getMetadata(
        PARAMETER_TOKEN,
        TestController,
        'index'
      ) as [{ fn: (req: Partial<NextApiRequest>) => string[] }]
      const fields = getValue({
        query: {
          fields: fieldsQueryValue,
        },
      })
      expect(fields).toEqual(['a', 'b', 'c'])
    }
  })

  it('should allow [*]', async () => {
    const fieldsQueryValues = [
      'a,*',
      '[*,b]',
      '[a, *]',
      "['a', '*']",
      '["a","*"]',
      '["a", "*"]',
      ['a', '*'],
      '*',
    ]
    for (let fieldsQueryValue of fieldsQueryValues) {
      class TestController {
        public index(@FieldsQuery(['a', 'b', 'c']) fields: string[]) {}
      }
      const [{ fn: getValue }] = Reflect.getMetadata(
        PARAMETER_TOKEN,
        TestController,
        'index'
      ) as [{ fn: (req: Partial<NextApiRequest>) => string[] }]
      const fields = getValue({
        query: {
          fields: fieldsQueryValue,
        },
      })
      expect(fields).toEqual(['*'])
    }
  })
})
