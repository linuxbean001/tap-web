import { ComponentMeta } from '@storybook/react'

import { SessionsOverTimeChart } from '.'

export default {
  title: 'pages/Dashboard/SessionsOverTimeChart',
  component: SessionsOverTimeChart,
} as ComponentMeta<typeof SessionsOverTimeChart>

const sessionsData = [
  { date: '2023-03-07T00:00:00.000Z', count: 5 },
  { date: '2023-03-08T00:00:00.000Z', count: 0 },
  { date: '2023-03-09T00:00:00.000Z', count: 0 },
  { date: '2023-03-10T00:00:00.000Z', count: 0 },
  { date: '2023-03-11T00:00:00.000Z', count: 10 },
  { date: '2023-03-12T00:00:00.000Z', count: 2 },
  { date: '2023-03-13T00:00:00.000Z', count: 0 },
  { date: '2023-03-14T00:00:00.000Z', count: 0 },
  { date: '2023-03-15T00:00:00.000Z', count: 0 },
  { date: '2023-03-16T00:00:00.000Z', count: 0 },
  { date: '2023-03-17T00:00:00.000Z', count: 0 },
  { date: '2023-03-18T00:00:00.000Z', count: 0 },
  { date: '2023-03-19T00:00:00.000Z', count: 0 },
  { date: '2023-03-20T00:00:00.000Z', count: 0 },
  { date: '2023-03-21T00:00:00.000Z', count: 0 },
  { date: '2023-03-22T00:00:00.000Z', count: 0 },
  { date: '2023-03-23T00:00:00.000Z', count: 5 },
  { date: '2023-03-24T00:00:00.000Z', count: 6 },
  { date: '2023-03-25T00:00:00.000Z', count: 0 },
  { date: '2023-03-26T00:00:00.000Z', count: 0 },
  { date: '2023-03-27T00:00:00.000Z', count: 0 },
  { date: '2023-03-28T00:00:00.000Z', count: 0 },
  { date: '2023-03-29T00:00:00.000Z', count: 0 },
  { date: '2023-03-30T00:00:00.000Z', count: 5 },
  { date: '2023-03-31T00:00:00.000Z', count: 20 },
  { date: '2023-04-01T00:00:00.000Z', count: 16 },
  { date: '2023-04-02T00:00:00.000Z', count: 0 },
  { date: '2023-04-03T00:00:00.000Z', count: 0 },
  { date: '2023-04-04T00:00:00.000Z', count: 0 },
  { date: '2023-04-05T00:00:00.000Z', count: 0 },
  { date: '2023-04-06T00:00:00.000Z', count: 2 },
]

export const Index = () => (
  <div className="w-[850px]">
    <SessionsOverTimeChart data={sessionsData} />
  </div>
)

Index.parameters = {
  storyshots: { disable: true },
}
