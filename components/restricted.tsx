import { ReactNode } from 'react'
import { useRole } from '../lib/contexts'
import { Role } from '../lib/domain/user'

type RestrictedProps = {
  to: keyof typeof Role
  children: ReactNode
  fallback?: JSX.Element | string
}

/**
 * Prevents its children from being displayed when the user does not have a specific role
 * @example
 * <Restricted to="Admin">
 *  <div>Hello World</div>
 * </Restricted>
 */
export const Restricted = ({ to, children, fallback }: RestrictedProps) => {
  const { isRole } = useRole()

  return <>{isRole(Role[to]) ? children : fallback}</>
}

export default Restricted
