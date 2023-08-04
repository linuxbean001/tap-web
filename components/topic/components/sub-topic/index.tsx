import classNames from 'classnames'
import React from 'react'
import Button from '../../../button'
import Spinner from '../../../spinner'
import SubTopicStatusIcon from './components/sub-topic-status-icon'

export type SubTopicStatus =
  | 'pending'
  | 'in-progress'
  | 'completed'
  | 'locked'
  | 'can-view'

export type SubTopicStatusVerb =
  | 'Viewed'
  | 'Started'
  | 'Continued'
  | 'Revisited'

export type SubTopicProps = {
  children?: any
  className?: any
  title: string
  description: string
  status: SubTopicStatus
  isLoading: boolean
  onViewAction?: React.MouseEventHandler<HTMLButtonElement>
} & React.HTMLAttributes<HTMLDivElement>

export function fmtSubTopicStatus(status: SubTopicStatus): SubTopicStatusVerb {
  switch (status.toLowerCase()) {
    case 'completed':
      return 'Revisited'
    case 'in-progress':
      return 'Continued'
    case 'can-view':
      return 'Viewed'
    default:
      return 'Started'
  }
}

function SubTopic(
  {
    children,
    className,
    title,
    description,
    status,
    isLoading,
    onViewAction,
    ...props
  }: SubTopicProps,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  const ViewActionLoader = ({ children }) => (
    <>
      {isLoading ? (
        <Spinner borderColor={'#0069E4'} className="mx-4" />
      ) : (
        children
      )}
    </>
  )
  return (
    <div
      {...props}
      className={classNames(className, 'w-full font-body text-sm bg-white')}
      ref={ref}
    >
      <div className="flex w-full p-4">
        <div className="p-2 inline-block w-1/12">
          <SubTopicStatusIcon status={status} />
        </div>
        <div className="flex flex-col w-3/4">
          <h4 className="font-bold">{title}</h4>
          <p className="text-dark-secondary">{description}</p>
        </div>

        <div
          className={classNames('flex w-1/6', {
            'items-center justify-items-center justify-end': true,
          })}
        >
          {status === 'locked' ? null : status === 'completed' ? (
            <Button
              className="flex px-4 py-2"
              theme="gray"
              onClick={onViewAction}
            >
              <ViewActionLoader>Revisit</ViewActionLoader>
            </Button>
          ) : status === 'in-progress' ? (
            <Button
              theme="blue"
              className="flex px-4 py-2"
              onClick={onViewAction}
            >
              <ViewActionLoader>Continue</ViewActionLoader>
            </Button>
          ) : status === 'can-view' ? (
            <Button
              className="flex px-4 py-2"
              theme="gray"
              onClick={onViewAction}
            >
              <ViewActionLoader>View</ViewActionLoader>
            </Button>
          ) : (
            <Button
              theme="blue"
              className="flex px-4 py-2"
              onClick={onViewAction}
            >
              <ViewActionLoader>Start</ViewActionLoader>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

const ForwardedRefSubTopic = React.forwardRef(SubTopic)

export default ForwardedRefSubTopic

export * from './components'
export { ForwardedRefSubTopic as SubTopic }
