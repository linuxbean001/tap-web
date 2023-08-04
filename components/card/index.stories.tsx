import { ComponentMeta } from '@storybook/react'
import { DateTime } from 'luxon'
import Image from 'next/image'

import Card from '.'
import {
  Progress,
  SkillDifficultyLabel,
  StatusLabel,
  TimeLabel,
} from './components'

export default {
  title: 'shared/Card',
  component: Card,
} as ComponentMeta<typeof Card>

const woodWorkImageUrl =
  'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80'

export const Index = () => (
  <Card style={{ maxWidth: '480px' }}>
    <div className="p-4">
      <h4 className="font-body text-md font-bold p-2">Robotic Handling</h4>
      <StatusLabel theme="yellow">Coming Soon</StatusLabel>
      <div className="flex flex-row p-2 text-dark-tertiary text-sm">
        <TimeLabel date={DateTime.local().minus({ hours: 1 }).toISO()} />
        <span className="inline-block px-2"></span>
        <SkillDifficultyLabel difficulty="Intermediate" />
      </div>
      <div className="p-2 text-dark-secondary text-sm">
        <p>Some description about the course and why you should take it.</p>
      </div>
    </div>
  </Card>
)

export const WithImage = () => (
  <Card
    style={{ maxWidth: '480px' }}
    Image={
      <Image
        src={woodWorkImageUrl}
        alt="Wood Work"
        width={640}
        height={480}
        className="w-full"
      />
    }
  >
    <div className="p-4">
      <h4 className="font-body text-md font-bold p-2">Wood Work</h4>
      <StatusLabel theme="green">Started</StatusLabel>
      <div className="flex flex-row p-2 text-dark-tertiary text-sm">
        <TimeLabel date={DateTime.local().minus({ hours: 1 }).toISO()} />
        <span className="inline-block px-2"></span>
        <SkillDifficultyLabel difficulty="Intermediate" />
      </div>
      <div className="p-2 text-dark-secondary text-sm">
        <p>Some description about the course and why you should take it.</p>
      </div>
    </div>
  </Card>
)

export const WithProgress = () => (
  <Card style={{ maxWidth: '480px' }}>
    <div className="p-4">
      <h4 className="font-body text-md font-bold p-2">Robotic Handling</h4>
      <StatusLabel theme="green">Started</StatusLabel>
      <Progress className="p-2" value={50}>
        3/9
      </Progress>
      <div className="p-2 text-dark-secondary text-sm">
        <p>Some description about the course and why you should take it.</p>
      </div>
    </div>
  </Card>
)
