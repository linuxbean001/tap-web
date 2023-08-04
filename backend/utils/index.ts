export function getTimestampUTC() {
  return new Date().toISOString()
}

export function getDaysBetweenDates(start: Date, end: Date): number {
  return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
}

export function fmtDateStringUS(date: Date): string {
  return `${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}`
}

export function getRootDomain(env: string = ''): string {
  const ENV = env || process.env.ENV
  if (ENV === 'local') {
    return 'localhost:3001'
  }
  return 'tap3d.com'
}

export function getAppDomain(env: string = ''): string {
  const ENV = env || process.env.ENV
  if (ENV === 'local') {
    return getRootDomain(ENV)
  }
  if (ENV === 'prod') {
    return `app.${getRootDomain(ENV)}`
  }
  return `${ENV}.app.${getRootDomain(ENV)}`
}

export function getAppDomainUrl(env: string = ''): string {
  const ENV = env || process.env.ENV
  return `https://${getAppDomain(ENV)}` // even localhost should run on HTTPS proxy
}

export function listToMap<T extends {}>(
  l: T[],
  key: string
): { [key: string]: T } {
  return l.reduce((map, v) => {
    if (key in v) {
      map[v[key]] = v
    }
    return map
  }, {})
}

export function EncodeURLSearchParams(params: { [key: string]: any }): string {
  return Object.entries(params)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    )
    .join('&')
}
