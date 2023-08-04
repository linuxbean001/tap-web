import NextLink, { LinkProps as NextLinkProps } from 'next/link'
import NextRouter from 'next/router'
import React from 'react'
import { format, UrlObject } from 'url'

import { setDefaultProps } from '../../../../lib'

export type LinkProps = {
  href: string | UrlObject
  children?: any
  className?: any
  isRouterActive?: boolean
  skipDataFetch?: boolean
} & Omit<NextLinkProps, 'href'> &
  React.HTMLAttributes<HTMLAnchorElement>

function Link(
  { children, className, isRouterActive, ...props }: LinkProps,
  ref: React.ForwardedRef<HTMLAnchorElement>
) {
  const href = typeof props.href === 'string' ? props.href : format(props.href)
  const linkAttrs = { ...props }
  delete linkAttrs.skipDataFetch
  return isRouterActive && Boolean(NextRouter.router) ? (
    <NextLink {...linkAttrs} className={className} ref={ref}>
      {children}
    </NextLink>
  ) : (
    <a
      className={className}
      {...linkAttrs}
      href={href}
      onClick={(e) => {
        e.preventDefault()
        NextRouter.push(href, href, {
          shallow: props.skipDataFetch,
        })
      }}
      ref={ref}
    >
      {children}
    </a>
  )
}

const ForwardedRefLink = React.forwardRef(Link)

setDefaultProps(ForwardedRefLink, {
  isRouterActive: !process.env.STORYBOOK,
})

export default ForwardedRefLink

export { ForwardedRefLink as Link }
