import { ComponentMeta } from '@storybook/react'

import Button from '.'

export default {
  title: 'shared/Button',
  component: Button,
} as ComponentMeta<typeof Button>

export const Index = () => (
  <div>
    <h2 className="font-body text-h-md">Buttons</h2>
    <div className="py-2"></div>
    <h3 className="font-body text-h-sm px-2">Light Theme</h3>
    <div className="flex flex-row">
      <div className="p-2">
        <Button className="px-4 py-2" theme="yellow" intensity="light">
          Click Me!
        </Button>
      </div>
      <div className="p-2">
        <Button className="px-4 py-2" theme="yellow" intensity="default">
          Click Me!
        </Button>
      </div>
      <div className="p-2">
        <Button className="px-4 py-2" theme="yellow" intensity="dark">
          Click Me!
        </Button>
      </div>
    </div>
    <div className="py-2"></div>
    <h3 className="font-body text-h-sm px-2">Dark Theme</h3>
    <div className="flex flex-row">
      <div className="p-2">
        <Button className="px-4 py-2" theme="gray" intensity="light">
          Click Me!
        </Button>
      </div>
      <div className="p-2">
        <Button className="px-4 py-2" theme="gray" intensity="default">
          Click Me!
        </Button>
      </div>
      <div className="p-2">
        <Button className="px-4 py-2" theme="gray" intensity="dark">
          Click Me!
        </Button>
      </div>
    </div>
    <div className="py-2"></div>
    <h3 className="font-body text-h-sm px-2">Disabled</h3>
    <div className="flex flex-row">
      <div className="p-2">
        <Button className="px-4 py-2" theme="yellow" disabled>
          Click Me!
        </Button>
      </div>
      <div className="p-2">
        <Button className="px-4 py-2" theme="gray" disabled>
          Click Me!
        </Button>
      </div>
    </div>
  </div>
)
