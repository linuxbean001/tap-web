import { ComponentMeta } from '@storybook/react'

import Nav from '.'

export default {
  title: 'shared/Nav',
  component: Nav,
} as ComponentMeta<typeof Nav>

export const NotLoggedIn = () => (
  <Nav
    className="mx-auto max-w-7xl"
    active="/courses"
    isLoggedIn={false}
    logout={() => {}}
    user={null}
    redirectToAccountPage={() => {}}
  />
)

export const LoggedIn = () => (
  <Nav
    className="mx-auto max-w-7xl"
    active="/courses"
    isLoggedIn={true}
    logout={() => {}}
    redirectToAccountPage={() => {}}
    user={{
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@tap3d.com',
    }}
  />
)
