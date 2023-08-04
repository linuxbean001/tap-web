import { NextApiRequest } from 'next'
import { PARAMETER_TOKEN } from 'next-api-decorators/dist/decorators'
import 'reflect-metadata'
import { ReferencesQuery } from './references-query'

describe('@ReferencesQuery()', () => {
  it('should accept empty allowedReferences', async () => {
    class TestController {
      public index(@ReferencesQuery([]) references: Record<string, boolean>) {}
    }
    const [{ fn: getValue }] = Reflect.getMetadata(
      PARAMETER_TOKEN,
      TestController,
      'index'
    ) as [{ fn: (req: Partial<NextApiRequest>) => Record<string, boolean> }]
    const references = getValue({
      query: {
        references: '',
      },
    })
    expect(references).toEqual({})
  })

  it('should allow all allowedReferences if req.query.references === null', async () => {
    class TestController {
      public index(
        @ReferencesQuery(['a', 'b', 'c']) references: Record<string, boolean>
      ) {}
    }
    const [{ fn: getValue }] = Reflect.getMetadata(
      PARAMETER_TOKEN,
      TestController,
      'index'
    ) as [{ fn: (req: Partial<NextApiRequest>) => Record<string, boolean> }]
    const references = getValue({
      query: {
        references: null,
      },
    })
    expect(references).toEqual({ a: true, b: true, c: true })
  })

  it('should allow all allowedReferences if req.query.references === "*"', async () => {
    class TestController {
      public index(
        @ReferencesQuery(['a', 'b', 'c']) references: Record<string, boolean>
      ) {}
    }
    const [{ fn: getValue }] = Reflect.getMetadata(
      PARAMETER_TOKEN,
      TestController,
      'index'
    ) as [{ fn: (req: Partial<NextApiRequest>) => Record<string, boolean> }]
    const references = getValue({
      query: {
        references: '*',
      },
    })
    expect(references).toEqual({ a: true, b: true, c: true })
  })

  it('should allow all allowedReferences if req.query.references === ["*"]', async () => {
    class TestController {
      public index(
        @ReferencesQuery(['a', 'b', 'c']) references: Record<string, boolean>
      ) {}
    }
    const [{ fn: getValue }] = Reflect.getMetadata(
      PARAMETER_TOKEN,
      TestController,
      'index'
    ) as [{ fn: (req: Partial<NextApiRequest>) => Record<string, boolean> }]
    const references = getValue({
      query: {
        references: ['*'],
      },
    })
    expect(references).toEqual({ a: true, b: true, c: true })
  })

  it('should allow [a, b] only', async () => {
    const referencesQueryValues = [
      'a,b',
      '[a,b]',
      '[a, b]',
      "['a', 'b']",
      '["a","b"]',
      '["a", "b"]',
      ['a', 'b'],
    ]
    for (let referencesQueryValue of referencesQueryValues) {
      class TestController {
        public index(
          @ReferencesQuery(['a', 'b', 'c']) references: Record<string, boolean>
        ) {}
      }
      const [{ fn: getValue }] = Reflect.getMetadata(
        PARAMETER_TOKEN,
        TestController,
        'index'
      ) as [{ fn: (req: Partial<NextApiRequest>) => Record<string, boolean> }]
      const references = getValue({
        query: {
          references: referencesQueryValue,
        },
      })
      expect(references).toEqual({ a: true, b: true })
    }
  })

  it('should allow [a, b, c] but default to [a,b]', async () => {
    const referencesQueryValues = ['a,b,c', '*']
    for (let referencesQueryValue of referencesQueryValues) {
      class TestController {
        public index(
          @ReferencesQuery(['a', 'b', 'c'], ['a', 'b'])
          references: Record<string, boolean>
        ) {}
      }
      const [{ fn: getValue }] = Reflect.getMetadata(
        PARAMETER_TOKEN,
        TestController,
        'index'
      ) as [{ fn: (req: Partial<NextApiRequest>) => Record<string, boolean> }]
      const references = getValue({
        query: {
          references: referencesQueryValue,
        },
      })
      if (referencesQueryValue === 'a,b,c') {
        expect(references).toEqual({ a: true, b: true, c: true })
      } else if (referencesQueryValue == '*') {
        expect(references).toEqual({ a: true, b: true })
      } else {
        throw new Error('Should not happen')
      }
    }
  })

  it('should allow [a, b, c]', async () => {
    const referencesQueryValues = [
      'a,*',
      '[*,b]',
      '[a, *]',
      "['a', '*']",
      '["a","*"]',
      '["a", "*"]',
      ['a', '*'],
      'a,b,c',
      'a,b,c,d',
      '*',
    ]
    for (let referencesQueryValue of referencesQueryValues) {
      class TestController {
        public index(
          @ReferencesQuery(['a', 'b', 'c']) references: Record<string, boolean>
        ) {}
      }
      const [{ fn: getValue }] = Reflect.getMetadata(
        PARAMETER_TOKEN,
        TestController,
        'index'
      ) as [{ fn: (req: Partial<NextApiRequest>) => Record<string, boolean> }]
      const references = getValue({
        query: {
          references: referencesQueryValue,
        },
      })
      expect(references).toEqual({ a: true, b: true, c: true })
    }
  })
})
