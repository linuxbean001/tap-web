export * from './assert.utils'
export * from './default-props.utils'
export * from './router.utils'

export function isBrowser(): Boolean {
  return typeof window !== 'undefined'
}
