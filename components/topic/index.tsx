import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline'
import classNames from 'classnames/dedupe'
import React, { useCallback, useState } from 'react'
import { useAnalytics } from '../../lib/contexts/analytics/analytics.provider'
import { setDefaultProps } from '../../lib/utils'
import { SubTopic, SubTopicProps, TopicStatusIcon } from './components'

export type TopicStatus = 'locked' | 'incompleted' | 'completed'
export type TopicProps<TActivityData = any> = {
  className?: any
  id: string
  title: string
  description: string
  status: TopicStatus
  subtopics?: (Pick<
    SubTopicProps,
    'title' | 'description' | 'status' | 'isLoading'
  > & {
    data: TActivityData
  })[]
  SubTopic?: React.FC<SubTopicProps>
  isOpen?: boolean
  onViewAction: (data: TActivityData) => void
} & React.HTMLAttributes<HTMLDivElement>

function Topic<TActivityData>(
  {
    className,
    id,
    title,
    description,
    subtopics,
    SubTopic,
    status,
    isOpen,
    onViewAction,
    ...props
  }: TopicProps<TActivityData>,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  const { analytics } = useAnalytics()

  const hasSubtopics = !!subtopics?.length
  const noOfCompletedSubTopics = subtopics?.filter(
    (sb) => sb.status === 'completed'
  ).length
  const [showSubtopics, setShowSubtopics] = useState(isOpen)

  const trackToggleSubtopics = useCallback(
    (show: boolean) => {
      if (show) {
        analytics.track('Close Topic', { id, title })
      } else {
        analytics.track('Open Topic', { id, title })
      }
    },
    [id, title, analytics]
  )

  const toggleSubtopics = () => {
    trackToggleSubtopics(showSubtopics)
    setShowSubtopics((show) => !show)
  }

  const ToggleButton = ({ children }) => (
    <button className="flex w-full text-left" onClick={toggleSubtopics}>
      {children}
    </button>
  )
  const Container = hasSubtopics ? ToggleButton : React.Fragment
  return (
    <div
      {...props}
      className={classNames(className, 'w-full font-body text-sm bg-gray-2')}
      ref={ref}
    >
      <Container>
        <div className="flex w-full p-4">
          <div className="p-2 flex w-1/12 items-start justify-items-center">
            <TopicStatusIcon status={status} />
          </div>
          <div className="flex flex-col w-3/4">
            <h4 className="font-bold">{title}</h4>
            <p className="text-dark-secondary">{description}</p>
          </div>

          <div
            className={classNames('flex w-1/6', {
              'items-center justify-end': !hasSubtopics,
            })}
          >
            {hasSubtopics ? (
              <div className="flex flex-row w-full text-xs items-center justify-end text-center">
                <span>
                  {noOfCompletedSubTopics}/{subtopics.length} complete
                </span>
                <span className="sm:px-2"></span>
                {showSubtopics ? (
                  <ChevronUpIcon className="h-5 w-5 text-gray-4" />
                ) : (
                  <ChevronDownIcon className="h-5 w-5 text-gray-4" />
                )}
              </div>
            ) : null}
          </div>
        </div>
      </Container>
      {showSubtopics && subtopics?.length
        ? subtopics.map(
            (sb, i) =>
              typeof SubTopic === 'function' && (
                <SubTopic
                  key={`${sb.title}-${i}`}
                  {...sb}
                  {...(status === 'locked' ? { status: 'locked' } : {})}
                  isLoading={sb.isLoading}
                  onViewAction={() => onViewAction(sb.data)}
                />
              )
          )
        : null}
    </div>
  )
}

const ForwardedRefTopic = React.forwardRef(Topic)

setDefaultProps(ForwardedRefTopic, {
  isOpen: false,
  SubTopic: (props) => <SubTopic {...props} />,
})

export default ForwardedRefTopic

export * from './components'
export { ForwardedRefTopic as Topic }
