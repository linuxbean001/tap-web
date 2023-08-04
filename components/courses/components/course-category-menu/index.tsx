import classNames from 'classnames'
import Image, { StaticImageData } from 'next/image'
import React from 'react'

import { Link } from '../../../../components/nav'
import { setDefaultProps } from '../../../../lib'
import { useAnalytics } from '../../../../lib/contexts/analytics/analytics.provider'

import _ from 'lodash'
import electricalActiveImage from './images/Electrical-active.svg'
import electricalImage from './images/Electrical.svg'
import hydraulicsActiveImage from './images/Hydraulics-active.svg'
import hydraulicsImage from './images/Hydraulics.svg'
import mechatronicsActiveImage from './images/Mechatronics-active.svg'
import mechatronicsImage from './images/Mechatronics.svg'
import OccupationsActiveImage from './images/Occupations-active.svg'
import OccupationsImage from './images/Occupations.svg'
import onboardingActiveImage from './images/Onboarding-active.svg'
import onboardingImage from './images/Onboarding.svg'
import pneumaticsActiveImage from './images/Pneumatics-active.svg'
import pneumaticsImage from './images/Pneumatics.svg'
import { default as vacuumActiveImage } from './images/Vacuum-active.svg'
import { default as vacuumImage } from './images/Vacuum.svg'
import WorkmanshipActiveImage from './images/Workmanship-active.svg'
import WorkmanshipImage from './images/Workmanship.svg'

type CourseCategoryMenuProps = {
  className?: any
  isActive: (href: string) => boolean
  categories?: {
    title: string
    activeImage: string | StaticImageData
    image: string | StaticImageData
    href: string
  }[]
} & React.HTMLAttributes<HTMLDivElement>

function CourseCategoryMenu(
  { className, categories, isActive, ...props }: CourseCategoryMenuProps,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  const { analytics } = useAnalytics()

  return (
    <div
      {...props}
      className={classNames(
        'grid grid-cols-3 md:grid-cols-10 text-dark-secondary text-sm border-b border-gray-2',
        className
      )}
      ref={ref}
    >
      {categories?.map((category, i) => (
        <Link
          key={`${category.title}-${i}`}
          className={classNames(
            'flex flex-row items-center justify-center py-6 px-4 border-b-2',
            {
              'border-blue-0': isActive(category.href),
              'border-transparent hover:border-gray-3': !isActive(
                category.href
              ),
            }
          )}
          href={isActive(category.href) ? '/courses' : category.href}
          skipDataFetch={true}
          onClick={() => {
            analytics.track('Clicked Course Category Menu', {
              category: category.title,
            })
          }}
        >
          <>
            <Image
              className={classNames('w-4 h-4', {
                'text-blue-0': isActive(category.href),
                'text-gray': !isActive(category.href),
              })}
              width={16}
              height={16}
              src={
                isActive(category.href) ? category.activeImage : category.image
              }
              alt={`Category: ${category.title}`}
            />
            <span
              className={classNames('p-2', {
                'text-blue-0': isActive(category.href),
                'text-gray': !isActive(category.href),
              })}
            >
              {category.title}
            </span>
          </>
        </Link>
      ))}
    </div>
  )
}

const ForwardedRefCourseCategoryMenu = React.forwardRef(CourseCategoryMenu)

setDefaultProps(ForwardedRefCourseCategoryMenu, {
  categories: _.orderBy(
    [
      {
        title: 'Electrical',
        activeImage: electricalActiveImage,
        image: electricalImage,
        href: '/courses?category=Electrical',
      },
      {
        title: 'Hydraulics',
        activeImage: hydraulicsActiveImage,
        image: hydraulicsImage,
        href: '/courses?category=Hydraulics',
      },
      {
        title: 'Mechatronics',
        activeImage: mechatronicsActiveImage,
        image: mechatronicsImage,
        href: '/courses?category=Mechatronics',
      },
      {
        title: 'Onboarding',
        activeImage: onboardingActiveImage,
        image: onboardingImage,
        href: '/courses?category=Onboarding',
      },
      {
        title: 'Pneumatics',
        activeImage: pneumaticsActiveImage,
        image: pneumaticsImage,
        href: '/courses?category=Pneumatics',
      },
      {
        title: 'Vacuum',
        activeImage: vacuumActiveImage,
        image: vacuumImage,
        href: '/courses?category=Vacuum',
      },
      {
        title: 'Workmanship',
        activeImage: WorkmanshipActiveImage,
        image: WorkmanshipImage,
        href: '/courses?category=Workmanship',
      },
      {
        title: 'Occupations',
        activeImage: OccupationsActiveImage,
        image: OccupationsImage,
        href: '/courses?category=Occupations',
      },
    ],
    ['title']
  ),
})

export default ForwardedRefCourseCategoryMenu

export { ForwardedRefCourseCategoryMenu as CourseCategoryMenu }
