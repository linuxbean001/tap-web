import classNames from 'classnames'
import Image from 'next/image'
import React from 'react'
import { setDefaultProps } from '../../../../lib'
import css from './jumbotron.module.css'

type JumbotronProps = {
  children?: any
  className?: any
} & React.HTMLAttributes<HTMLDivElement>

function Jumbotron(
  { children, className, ...props }: JumbotronProps,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  return (
    <div
      {...props}
      className={classNames(
        'flex w-full bg-gray-12 relative overflow-hidden',
        css.jumbotron
      )}
      ref={ref}
    >
      <div
        className="hidden sm:flex w-full h-full absolute bg-contain bg-cover bg-no-repeat bg-right"
        style={{
          backgroundImage: `url(/images/courses-banner-v1.jpg)`,
        }}
      ></div>
      <div className="p-8 z-10">
        <div className="pt-0 md:pt-8 hidden sm:flex">
          <Image
            className="w-8 h-8 md:w-24 md:h-24"
            width={164}
            height={177}
            src="/tap_reskin_white.svg"
            alt="Tap3d"
          />
        </div>
        <div className="py-4 w-1/2 md:w-2/3 lg:w-full">
          <h2 className="text-h-md sm:text-h-lg font-heading font-bold text-white py-4 sm:py-0">
            Your craft starts here
          </h2>
          <p className="text-gray-11 text-sm sm:text-md font-body w-5/6">
            Become an expert technician. Get started with one of our courses
            today.
          </p>
        </div>
      </div>
    </div>
  )
}

const ForwardedRefJumbotron = React.forwardRef(Jumbotron)

setDefaultProps(ForwardedRefJumbotron, {})

export default ForwardedRefJumbotron

export { ForwardedRefJumbotron as Jumbotron }
