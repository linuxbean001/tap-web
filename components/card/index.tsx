import classNames from 'classnames/dedupe'
import React from 'react'
import { setDefaultProps } from '../../lib/utils'

type CardProps = {
  children: JSX.Element
  className?: any
  Image?: JSX.Element
} & React.HTMLAttributes<HTMLDivElement>

function Card(
  { children, className, Image, ...props }: CardProps,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  return (
    <div
      {...props}
      ref={ref}
      className={classNames(className, 'relative bg-gray-1 flex flex-col')}
    >
      <div className="flex h-full">
        {Image ? (
          Image
        ) : (
          <div className="bg-gray-11 inline-block w-full pb-4">
            <svg
              className="inline-block w-2/3"
              viewBox="0 0 265 170"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M-57 -231.534C-57 -262.167 -30.4945 -287 2.2018 -287H205.798C238.494 -287 265 -262.167 265 -231.534V48.4614C265 67.988 254.041 86.0761 236.146 96.0856L104 170L-28.1456 96.0856C-46.0408 86.0761 -57 67.988 -57 48.4614V-231.534ZM2.2018 -257.238C-12.9501 -257.238 -25.2332 -245.73 -25.2332 -231.534V48.4614C-25.2332 57.5103 -20.1545 65.8926 -11.8616 70.5312L104 135.337L219.862 70.5312C228.155 65.8926 233.233 57.5103 233.233 48.4614V-231.534C233.233 -245.73 220.95 -257.238 205.798 -257.238H2.2018Z"
                fill="#E5E7EB"
              />
            </svg>
          </div>
        )}
      </div>
      <div>{children}</div>
    </div>
  )
}

const ForwardedRefCard = React.forwardRef(Card)

setDefaultProps(ForwardedRefCard, {})

export default ForwardedRefCard

export * from './components'
export { ForwardedRefCard as Card }
