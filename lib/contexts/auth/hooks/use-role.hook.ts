import { Tap } from '../../../domain'
import { Role } from '../../../domain/user'
import { useCurrentUser } from './use-current-user.hook'

export const useRole = () => {
  const { user } = useCurrentUser()
  return {
    role: user?.role,
    isAdmin: () => user?.role === Role.Admin,
    isMember: () => user?.role === Role.Member,
    isOwner: () => user?.role === Role.Owner,
    isRole: (role: Tap.User['role']) => user?.role === role,
  }
}
