import { UserMetadata } from '@propelauth/express'

export const users = [
  {
    userId: 'usr-1',
    email: 'john.doe.member@haldotech.io',
    orgIdToOrgInfo: {
      'usr-org-1': {
        orgId: 'usr-org-1',
        role: 0,
        assignedRole: 'Admin',
      } as any,
    },
  } as Partial<UserMetadata>,
  {
    userId: 'usr-2',
    email: 'sarah.doe.member@haldotech.io',
    orgIdToOrgInfo: {
      'usr-org-1': {
        orgId: 'usr-org-1',
        role: 0,
        assignedRole: 'Admin',
      } as any,
    },
  } as Partial<UserMetadata>,
]
