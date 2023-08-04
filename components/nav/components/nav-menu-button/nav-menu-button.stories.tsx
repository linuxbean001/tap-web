import { Disclosure } from '@headlessui/react'
import { ComponentMeta } from '@storybook/react'

import NavMenuButton from '.'

export default {
  title: 'shared/Nav/NavMenuButton',
  component: NavMenuButton,
} as ComponentMeta<typeof NavMenuButton>

export const Closed = () => (
  <Disclosure
    as="div"
    className="p-4 bg-yellow-4 flex items-end justify-end"
    defaultOpen
  >
    <NavMenuButton className={{ 'sm:hidden': false }} open={false} />
  </Disclosure>
)

export const Open = () => (
  <Disclosure
    as="div"
    className="p-4 bg-yellow-4 flex items-end justify-end"
    defaultOpen
  >
    <NavMenuButton className={{ 'sm:hidden': false }} open={true} />
  </Disclosure>
)
