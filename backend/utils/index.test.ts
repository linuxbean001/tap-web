import {
  EncodeURLSearchParams,
  fmtDateStringUS,
  getDaysBetweenDates,
} from './index'

describe('EncodeURLSearchParams', () => {
  it('should encode', () => {
    expect(
      EncodeURLSearchParams({
        a: 'a',
        b: 'b',
        c: 'aaa bbb',
        d: '12345',
      })
    ).toBe('a=a&b=b&c=aaa%20bbb&d=12345')
  })
})

describe('getDaysBetweenDates', () => {
  it('base case', () => {
    expect(
      getDaysBetweenDates(
        new Date('2023-06-01T18:00:00.000Z'),
        new Date('2023-06-31T18:00:00.000Z')
      )
    ).toBe(30)
  })
  it('same date', () => {
    expect(getDaysBetweenDates(new Date(), new Date())).toBe(0)
  })
  it('day after', () => {
    expect(
      getDaysBetweenDates(
        new Date('2023-06-01T18:00:00.000Z'),
        new Date('2023-06-02T18:00:00.000Z')
      )
    ).toBe(1)
  })
  it('before is later than after', () => {
    expect(
      getDaysBetweenDates(
        new Date('2023-06-05T18:00:00.000Z'),
        new Date('2023-06-01T18:00:00.000Z')
      )
    ).toBe(-4)
  })
})

describe('fmtDateStringUS', () => {
  it('base case', () => {
    expect(fmtDateStringUS(new Date('2023-06-01T18:00:00.000Z'))).toBe(
      '6-1-2023'
    )
  })
})
