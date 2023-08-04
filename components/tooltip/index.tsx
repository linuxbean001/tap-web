import classNames from 'classnames'
import {
  ForwardedRef,
  ReactNode,
  forwardRef,
  useCallback,
  useRef,
  useState,
} from 'react'
import { useAnalytics } from '../../lib/contexts/analytics/analytics.provider'
import { setDefaultProps } from '../../lib/utils/default-props.utils'
type Props = Partial<{
  delay: number
  direction: 'top' | 'left' | 'right' | 'bottom'
  children: ReactNode
  content: string
  className?: string
}>

const Tooltip = (
  { delay = 400, children, content = '', direction = 'top', className }: Props,
  ref: ForwardedRef<HTMLDivElement>
) => {
  const { analytics } = useAnalytics()
  const [active, setActive] = useState(false)
  const timeout = useRef<number>()

  const showTip = useCallback(() => {
    timeout.current = window.setTimeout(() => {
      analytics.track('Display Tooltip', { content })
      setActive(true)
    }, delay)
  }, [content, delay, analytics])

  const hideTip = useCallback(() => {
    clearTimeout(timeout.current)
    setActive(false)
  }, [])

  const wrappedClasses = classNames(['tooltip', className])
  return (
    <div
      className={wrappedClasses}
      onMouseEnter={showTip}
      onMouseLeave={hideTip}
      ref={ref}
    >
      {children}
      {active && <div className={`tooltip-tip ${direction}`}>{content}</div>}
    </div>
  )
}
const ForwardedRefTooltip = forwardRef(Tooltip)

setDefaultProps(ForwardedRefTooltip, {})

export default ForwardedRefTooltip

export { ForwardedRefTooltip as Tooltip }
