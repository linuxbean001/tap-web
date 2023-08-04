import Router from 'next/router'

export function isRouterActive(): Boolean {
  return !!Router.router
}
