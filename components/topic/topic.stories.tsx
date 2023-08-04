import { ComponentMeta } from '@storybook/react'

import Topic, { TopicProps } from '.'

export default {
  title: 'shared/Topic',
  component: Topic,
} as ComponentMeta<typeof Topic>

const subtopics = [
  {
    title: 'Subtopic 1',
    description:
      'Description about this subtopic. Lorem Ipsum Dolor Sit Amet. Lorem Ipsum Dolor Sit Amet. Lorem Ipsum Dolor Sit Amet',
    status: 'pending',
    href: '#',
  },
  {
    title: 'Subtopic 2',
    description: 'Description about this subtopic. Lorem Ipsum Dolor Sit Amet',
    status: 'in-progress',
    href: '#',
  },
  {
    title: 'Subtopic 3',
    description: 'Description about this subtopic. Lorem Ipsum Dolor Sit Amet',
    status: 'completed',
  },
] as TopicProps['subtopics']

export const WithLockedStatus = () => (
  <Topic
    id="topic-1"
    title="Topic"
    description="Description about this topic"
    status="locked"
    className="w-full"
    subtopics={subtopics.map((subtopic) => ({
      ...subtopic,
      status: 'locked',
    }))}
    onViewAction={() => new Promise((resolve) => setTimeout(resolve, 750))}
  />
)

export const WithIncompletedStatus = () => (
  <Topic
    id="topic-1"
    title="Topic"
    description="Description about this topic"
    status="incompleted"
    className="w-full"
    subtopics={subtopics}
    onViewAction={() => new Promise((resolve) => setTimeout(resolve, 750))}
  />
)

export const WithCompletedStatus = () => (
  <Topic
    id="topic-1"
    title="Topic"
    description="Description about this topic"
    status="completed"
    className="w-full"
    subtopics={subtopics.map((subtopic) => ({
      ...subtopic,
      status: 'completed',
    }))}
    onViewAction={() => new Promise((resolve) => setTimeout(resolve, 750))}
  />
)
