export type NavUser = {
  username?: string
  firstName?: string
  lastName?: string
  email: string
}

export const getUsername = (user: NavUser) =>
  user.username ||
  [user.firstName, user.lastName]
    .filter((name) => !!name)
    .map((name) => name || '')
    .join(' ') ||
  user.email

export const getUserInitials = (name: string) => {
  return name
    .split(' ')
    .map((chunk) => chunk[0])
    .filter(Boolean)
    .join('')
}
