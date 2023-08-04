import UsersService from './user.service'

describe('UsersService', () => {
  it('should getUsersInOrg', async () => {
    const service = new UsersService()

    const users = await service.getUsersInOrg('org-1', {
      getUsersInOrg: async () => {
        return {
          users: [
            {
              email: 'test+member@tap3d.com',
              userId: '123',
              firstName: 'Test',
              lastName: 'Member',
              enabled: true,
              orgIdToOrgInfo: {
                'org-1': {
                  orgId: 'org-1',
                  orgName: 'My Org',
                  userAssignedRole: 'Member',
                },
              },
            },
            {
              email: 'test+admin@tap3d.com',
              userId: '456',
              firstName: 'Test',
              lastName: 'Admin',
              enabled: true,
              orgIdToOrgInfo: {
                'org-1': {
                  orgId: 'org-1',
                  orgName: 'My Org',
                  userAssignedRole: 'Admin',
                },
              },
            },
          ],
          totalUsers: 2,
          currentPage: 0,
          pageSize: 50,
          hasMoreResults: false,
        } as any
      },
    })
    expect(users).toEqual([
      {
        email: 'test+member@tap3d.com',
        firstName: 'Test',
        groups: [],
        id: '123',
        lastName: 'Member',
        organization: {
          id: 'org-1',
          name: 'My Org',
        },
        role: 0,
      },
      {
        email: 'test+admin@tap3d.com',
        firstName: 'Test',
        groups: [],
        id: '456',
        lastName: 'Admin',
        organization: {
          id: 'org-1',
          name: 'My Org',
        },
        role: 1,
      },
    ])
  })
})
