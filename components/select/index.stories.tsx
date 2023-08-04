import { ComponentMeta } from '@storybook/react'

import Select from '.'

export default {
  title: 'shared/Select',
  component: Select,
} as ComponentMeta<typeof Select>

const mockOnChange = (e) => {}

export const Index = () => (
  <Select
    options={
      [
        {
          value: 'a',
          label: 'A',
        },
      ] as const
    }
    value="a"
    onChange={mockOnChange}
  />
)

export const WithChildren = () => (
  <Select value="hello" onChange={mockOnChange}>
    <option value="hello">Hello</option>
    <option value="world">World</option>
  </Select>
)

export const WithRequired = () => (
  <Select required onChange={mockOnChange}>
    <option value="hello">Hello</option>
    <option value="world">World</option>
  </Select>
)

export const WithTitle = () => (
  <Select title="Title" onChange={mockOnChange}>
    <option value="hello">Hello</option>
    <option value="world">World</option>
  </Select>
)

export const WithFullWidth = () => (
  <Select className="w-full" onChange={mockOnChange}>
    <option value="hello">Hello</option>
    <option value="world">World</option>
  </Select>
)

export const Disabled = () => (
  <Select className="w-full" disabled onChange={mockOnChange}>
    <option value="hello">Hello</option>
    <option value="world">World</option>
  </Select>
)

export const Valid = () => (
  <Select className="w-full" valid onChange={mockOnChange}>
    <option value="hello">Hello</option>
    <option value="world">World</option>
  </Select>
)

export const Invalid = () => (
  <Select className="w-full" valid={false} onChange={mockOnChange}>
    <option value="hello">Hello</option>
    <option value="world">World</option>
  </Select>
)

export const Multiple = () => (
  <Select className="w-full" multiple onChange={mockOnChange}>
    <option value="hello">Hello</option>
    <option value="world">World</option>
  </Select>
)

export const ReadOnly = () => (
  <Select
    className="w-full"
    value="hello"
    aria-readonly={true}
    onChange={mockOnChange}
  >
    <option value="hello">Hello</option>
    <option value="world">World</option>
  </Select>
)

Multiple.parameters = {
  storyshots: { disable: true },
}
