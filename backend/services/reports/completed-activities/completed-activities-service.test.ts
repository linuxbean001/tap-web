import CompletedActivitiesService from './completed-activities.service'

describe('CompletedActivitiesService', () => {
  describe('generateDateMap', () => {
    it('base case', async () => {
      const dates = CompletedActivitiesService.generateDateMap(
        new Date('2023-06-17T18:00:00.000Z'),
        new Date('2023-06-19T18:00:00.000Z')
      )

      expect(dates).toEqual({
        '2023-06-18': {
          count: 0,
        },
        '2023-06-19': {
          count: 0,
        },
      })
    })

    it('30 days', async () => {
      const dates = CompletedActivitiesService.generateDateMap(
        new Date('2023-06-01T18:00:00.000Z'),
        new Date('2023-06-31T18:00:00.000Z')
      )
      expect(Object.keys(dates).length).toEqual(30)
    })

    it('same dates', async () => {
      const dates = CompletedActivitiesService.generateDateMap(
        new Date(),
        new Date()
      )
      expect(dates).toEqual({})
    })

    it('same dates', async () => {
      const dates = CompletedActivitiesService.generateDateMap(
        new Date('2023-06-17T18:00:00.000Z'),
        new Date('2023-06-19T18:00:00.000Z')
      )
    })
  })

  describe('getCompletedActivities', () => {
    const service = new CompletedActivitiesService({
      // Mock knex
      raw: jest.fn().mockReturnValue({
        rows: [
          {
            id: 'a',
            completed_at: '2023-06-17T18:00:00.000Z',
          },
          {
            id: 'b',
            completed_at: '2023-06-18T18:00:00.000Z',
          },
          {
            id: 'c',
            completed_at: '2023-06-18T18:00:00.000Z',
          },
          {
            id: 'd',
            completed_at: '2023-06-18T18:00:00.000Z',
          },
          {
            id: 'e',
            completed_at: '2023-06-19T18:00:00.000Z',
          },
          {
            id: 'f',
            completed_at: '2023-06-19T18:00:00.000Z',
          },
        ],
      }),
    } as any)

    it('base case', async () => {
      const completedActivites = await service.getCompletedActivities(
        'userId',
        {
          start: new Date('2023-06-17T18:00:00.000Z'),
          end: new Date('2023-06-21T18:00:00.000Z'),
        }
      )
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
          count: 2,
        },
        {
          date: '2023-06-18',
          count: 3,
        },
      ])
    })

    it('empty case', async () => {
      const completedActivites = await service.getCompletedActivities(
        'userId',
        {}
      )
      expect(completedActivites).toEqual([])
    })

    it('no completed activities case', async () => {
      const service = new CompletedActivitiesService({
        // Mock knex
        raw: jest.fn().mockReturnValue({
          rows: [],
        }),
      } as any)
      const completedActivites = await service.getCompletedActivities(
        'userId',
        {
          start: new Date('2023-06-17T18:00:00.000Z'),
          end: new Date('2023-06-21T18:00:00.000Z'),
        }
      )
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
      ])
    })
  })
})
