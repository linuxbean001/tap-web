import { Tap } from '../../../../lib'
import AdminCompletedActivitiesService from './admin-completed-activities.service'

describe('AdminCompletedActivitiesService', () => {
  describe('getCompletedActivities', () => {
    const service = new AdminCompletedActivitiesService(
      {
        // Mock knex
        raw: jest.fn().mockReturnValue({
          rows: [
            {
              user_id: '1',
              id: 'a',
              completed_at: '2023-06-17T18:00:00.000Z',
            },
            {
              user_id: '1',
              id: 'b',
              completed_at: '2023-06-17T18:00:00.000Z',
            },
            {
              user_id: '2',
              id: 'c',
              completed_at: '2023-06-18T18:00:00.000Z',
            },
            {
              user_id: '3',
              id: 'd',
              completed_at: '2023-06-18T18:00:00.000Z',
            },
            {
              user_id: '3',
              id: 'e',
              completed_at: '2023-06-19T18:00:00.000Z',
            },
            {
              user_id: '4',
              id: 'e',
              completed_at: '2023-06-19T18:00:00.000Z',
            },
          ],
        }),
      } as any,
      // Mock user service
      {
        getUsersInOrg: jest.fn().mockReturnValue([
          {
            id: '1',
            role: Tap.User.Role.Member,
          },
          {
            id: '2',
            role: Tap.User.Role.Member,
          },
          {
            id: '3',
            role: Tap.User.Role.Member,
          },
        ]),
      } as any
    )

    it('base case', async () => {
      const completedActivites = await service.getCompletedActivities('orgId', {
        start: new Date('2023-06-17T18:00:00.000Z'),
        end: new Date('2023-06-21T18:00:00.000Z'),
      })
      expect(completedActivites).toEqual([
        {
          date: '2023-06-21',
          count: 0,
        },
        {
          date: '2023-06-20',
          count: 0,
        },
        {
          date: '2023-06-19',
          count: 1,
        },
        {
          date: '2023-06-18',
          count: 2,
        },
        {
          date: '2023-06-17',
          count: 2,
        },
      ])
    })

    it('empty case', async () => {
      const completedActivites = await service.getCompletedActivities(
        'orgId',
        {}
      )
      expect(completedActivites).toEqual([])
    })

    it('no completed activities case', async () => {
      const service = new AdminCompletedActivitiesService(
        {
          // Mock knex
          raw: jest.fn().mockReturnValue({
            rows: [],
          }),
        } as any,
        // Mock user service
        {
          getUsersInOrg: jest.fn().mockReturnValue([
            {
              id: '1',
              role: Tap.User.Role.Member,
            },
          ]),
        } as any
      )

      const completedActivites = await service.getCompletedActivities('orgId', {
        start: new Date('2023-06-17T18:00:00.000Z'),
        end: new Date('2023-06-21T18:00:00.000Z'),
      })
      expect(completedActivites).toEqual([
        {
          date: '2023-06-21',
          count: 0,
        },
        {
          date: '2023-06-20',
          count: 0,
        },
        {
          date: '2023-06-19',
          count: 0,
        },
        {
          date: '2023-06-18',
          count: 0,
        },
        {
          date: '2023-06-17',
          count: 0,
        },
      ])
    })
  })
})
