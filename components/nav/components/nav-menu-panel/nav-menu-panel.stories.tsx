import { Disclosure } from '@headlessui/react'
import { ComponentMeta } from '@storybook/react'

import NavMenuPanel from '.'

export default {
  title: 'shared/Nav/NavMenuPanel',
  component: NavMenuPanel,
} as ComponentMeta<typeof NavMenuPanel>

export const Index = () => (
  <Disclosure as={'div'} defaultOpen>
    <NavMenuPanel
      className={{ 'sm:hidden': false }}
      isActive={(href) => href === '/courses'}
      isLoggedIn={true}
      onClickUpdateUser={() => {}}
      links={
        [
          {
            text: 'Courses',
            href: '/courses',
          },
          {
            text: 'My Progress',
            href: '/my-progress',
          },
          {
            text: 'Help',
            href: '/help',
          },
        ] as const
      }
      onClickLogout={() => {}}
      user={{
        name: 'John Doe',
        email: 'john.doe@tap3d.com',
      }}
    />
  </Disclosure>
)
