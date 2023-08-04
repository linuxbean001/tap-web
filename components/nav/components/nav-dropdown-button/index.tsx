import { Menu, Transition } from '@headlessui/react'
import classNames from 'classnames'
import React from 'react'

type NavDropdownButtonProps = {
  children: string
  className?: any
  onClickLogout: () => void
  onClickUpdateUser: () => void
} & React.HTMLAttributes<HTMLDivElement>

function NavDropdownButton(
  {
    children,
    className,
    onClickLogout,
    onClickUpdateUser,
    ...props
  }: NavDropdownButtonProps,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  return (
    <div
      {...props}
      className="hidden sm:ml-6 sm:flex sm:items-center"
      ref={ref}
    >
      {/* Profile dropdown */}
      <Menu as="div" className="relative ml-3">
        <div>
          <Menu.Button className="flex max-w-xs items-center rounded-full text-sm text-dark-primary">
            <span className="">{children}</span>
          </Menu.Button>
        </div>
        <Transition
          as={React.Fragment}
          enter="transition ease-out duration-200"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-gray-0 py-1 shadow-lg">
            <Menu.Item key={'Update User'}>
              {({ active }) => (
                <button
                  onClick={onClickUpdateUser}
                  className={classNames(
                    active ? 'bg-gray-1' : '',
                    'block w-full text-start px-4 py-2 text-sm text-gray-7'
                  )}
                >
                  Update User Profile
                </button>
              )}
            </Menu.Item>
            <Menu.Item key={'Log Out'}>
              {({ active }) => (
                <button
                  onClick={onClickLogout}
                  className={classNames(
                    active ? 'bg-gray-1' : '',
                    'block w-full text-start px-4 py-2 text-sm text-gray-7'
                  )}
                >
                  Log Out
                </button>
              )}
            </Menu.Item>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  )
}

const ForwardedRefNavDropdownButton = React.forwardRef(NavDropdownButton)

export default ForwardedRefNavDropdownButton

export { ForwardedRefNavDropdownButton as NavDropdownButton }
