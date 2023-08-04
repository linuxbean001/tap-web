import { ComponentMeta } from '@storybook/react'
import React, { useEffect, useRef } from 'react'

import NavDropdownButton from '.'

export default {
  title: 'shared/Nav/NavDropdownButton',
  component: NavDropdownButton,
} as ComponentMeta<typeof NavDropdownButton>

export const Index = () => {
  const ref = useRef<HTMLDivElement>() as React.RefObject<HTMLDivElement>
  useEffect(() => {
    ref.current?.querySelector('button')?.click()
  }, [])

  return (
    <div className="flex w-full items-end justify-end">
      <NavDropdownButton
        onClickUpdateUser={() => {}}
        ref={ref}
        onClickLogout={() => {}}
      >
        John Doe
      </NavDropdownButton>
    </div>
  )
}
