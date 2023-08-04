import OrganizationService from './organization.service'

describe('OrganizationService', () => {
  it('should getOrganizations', async () => {
    const service = new OrganizationService()
    const organizations = await service.getOrganizations({
      getOrganizations: async () => [
        {
          name: 'My Org',
          orgId: 'org-1',
        },
      ],
    })
    expect(organizations).toEqual([
      {
        name: 'My Org',
        id: 'org-1',
      },
    ])
  })

  it('should getOrganization', async () => {
    const service = new OrganizationService()
    const organization = await service.getOrganization('org-1', {
      getOrganization: async () => ({
        name: 'My Org',
        id: 'org-1',
      }),
    })
    expect(organization).toEqual({
      name: 'My Org',
      id: 'org-1',
    })
  })
})
