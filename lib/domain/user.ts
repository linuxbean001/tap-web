export type User = {
  id: string
  email: string
  firstName: string
  lastName: string
  role: (typeof Role)[keyof typeof Role]
  groups: User.Group[]
  organization?: User.Organization
}

export default User

export const Role = {
  Unknown: -1,
  Member: 0,
  Admin: 1,
  Owner: 2,
} as const

export namespace User {
  export interface Group {
    id: string
    name: string
    users?: User[]
    organization?: Organization
  }

  export interface Organization {
    id: string
    name: string
  }

  export interface Metrics {
    id: string
    userId: string
    organizationId: string
    type: string
    value: string
  }

  export interface AdminMetrics {
    organizationId: string
    type: string
    value: string
  }
}

export function fmtRole(
  role: (typeof Role)[keyof typeof Role]
): keyof typeof Role {
  switch (role) {
    case Role.Member:
      return 'Member'
    case Role.Admin:
      return 'Admin'
    case Role.Owner:
      return 'Owner'
    default:
      return 'Unknown'
  }
}
