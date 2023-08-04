import { ComponentMeta } from '@storybook/react'
import { DateTime } from 'luxon'

import TimeLabel from '.'

export default {
  title: 'shared/card/TimeLabel',
  component: TimeLabel,
} as ComponentMeta<typeof TimeLabel>

export const Index = () => (
  <TimeLabel date={DateTime.local().minus({ hours: 1 }).toJSDate()} />
)

export const WithISODate = () => (
  <TimeLabel date={DateTime.local().minus({ hours: 1 }).toISO()} />
)

export const WithText = () => <TimeLabel text="2m 30s" />
