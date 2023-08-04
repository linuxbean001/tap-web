import { forwardRef, HTMLAttributes, ReactNode } from 'react'
import { setDefaultProps } from '../../../../lib'

type Props = {
  title: string
  icon?: ReactNode
  value: string | number
} & HTMLAttributes<HTMLDivElement>

const ProgressInfoBlock = (
  { title, icon = false, value, ...rest }: Props,
  ref: React.ForwardedRef<HTMLDivElement>
) => {
  return (
    <div
      className="flex flex-col-2 py-2 md:py-0 justify-between md:justify-inherit items-center md:items-inherit md:flex-col px-6"
      ref={ref}
      {...rest}
    >
      <span className="text-dark-secondary text-h-xs font-medium mb-4 mt-4 md:mt-0">
        {title}
        {icon}
      </span>
      <p className="text-dark-primary text-h-md md:text-h3-lg font-medium">
        {value}
      </p>
    </div>
  )
}

const ForwardedRefProgressInfoBlock = forwardRef(ProgressInfoBlock)

setDefaultProps(ForwardedRefProgressInfoBlock, {})

export default ForwardedRefProgressInfoBlock

export { ForwardedRefProgressInfoBlock as ProgressInfoBlock }
