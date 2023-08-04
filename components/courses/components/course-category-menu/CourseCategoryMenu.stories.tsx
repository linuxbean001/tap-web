import { ComponentMeta } from '@storybook/react'

import CourseCategoryMenu from '.'

import electronicsActiveImage from './images/Electrical-active.svg'
import hydraulicsActiveImage from './images/Hydraulics-active.svg'
import electronicsImage from './images/electronics.png'
import hydraulicsImage from './images/hydraulics.png'

export default {
  title: 'pages/Courses/CourseCategoryMenu',
  component: CourseCategoryMenu,
} as ComponentMeta<typeof CourseCategoryMenu>

export const Index = () => (
  <CourseCategoryMenu
    isActive={(href) => href === '/courses?category=Electrical'}
  />
)

export const CustomList = () => (
  <CourseCategoryMenu
    isActive={(href) => href === '/courses?category=Electrical'}
    categories={[
      {
        title: 'Electronics',
        activeImage: electronicsActiveImage,
        image: electronicsImage,
        href: '/courses?category=Electronics',
      },
      {
        title: 'Hydraulics',
        activeImage: hydraulicsActiveImage,
        image: hydraulicsImage,
        href: '/courses?category=Hydraulics',
      },
    ]}
  />
)
