import { createParamDecorator } from 'next-api-decorators'

const DateRangeKeys: string[] = ['start', 'end']

export type DateRangeQueryResult = { start?: Date; end?: Date }

export const DateRangeQuery = () => {
  const decorator = createParamDecorator<DateRangeQueryResult>((req) => {
    const daterange: string | string[] = req.query.daterange
    let dateRangeObj = {}
    if (Array.isArray(daterange)) {
      if (daterange.length > 0) {
        dateRangeObj = JSON.parse(daterange[0])
      }
    } else {
      if (daterange && daterange.trim()) {
        dateRangeObj = JSON.parse(daterange)
      }
    }
    return Object.keys(dateRangeObj)
      .filter((key) => DateRangeKeys.includes(key))
      .reduce((obj, key) => {
        obj[key] = new Date(dateRangeObj[key])
        return obj
      }, {} as DateRangeQueryResult)
  })
  return decorator()
}
