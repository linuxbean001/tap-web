import { ComponentMeta } from '@storybook/react'

import AutocompleteInput from '.'

export default {
  title: 'shared/AutocompleteInput',
  component: AutocompleteInput,
} as ComponentMeta<typeof AutocompleteInput>

const options = [
  { value: '1', label: 'Durward Reynolds' },
  { value: '2', label: 'Kenton Towne' },
  { value: '3', label: 'Therese Wunsch' },
  { value: '4', label: 'Benedict Kessler' },
  { value: '5', label: 'Katelyn Rohan' },
  { value: '6', label: 'Kenton Towne' },
  { value: '7', label: 'Therese Wunsch' },
  { value: '8', label: 'Benedict Kessler' },
  { value: '9', label: 'Katelyn Rohan' },
] as const

export const Index = () => <AutocompleteInput options={options} value="1" />

export const WithTitle = () => (
  <AutocompleteInput options={options} value="1" title="Title">
    <option value="hello">Hello</option>
    <option value="world">World</option>
  </AutocompleteInput>
)

export const WithFullWidth = () => (
  <AutocompleteInput options={options} value="1" className="w-full">
    <option value="hello">Hello</option>
    <option value="world">World</option>
  </AutocompleteInput>
)

export const Disabled = () => (
  <AutocompleteInput options={options} value="1" className="w-full" disabled>
    <option value="hello">Hello</option>
    <option value="world">World</option>
  </AutocompleteInput>
)

export const Valid = () => (
  <AutocompleteInput options={options} value="1" className="w-full" valid>
    <option value="hello">Hello</option>
    <option value="world">World</option>
  </AutocompleteInput>
)

export const Invalid = () => (
  <AutocompleteInput
    options={options}
    value="1"
    className="w-full"
    valid={false}
  >
    <option value="hello">Hello</option>
    <option value="world">World</option>
  </AutocompleteInput>
)

export const Multiple = () => (
  <AutocompleteInput options={options} value="1" className="w-full" multiple>
    <option value="hello">Hello</option>
    <option value="world">World</option>
  </AutocompleteInput>
)

export const ReadOnly = () => (
  <AutocompleteInput
    options={options}
    value="1"
    className="w-full"
    aria-readonly={true}
  >
    <option value="hello">Hello</option>
    <option value="world">World</option>
  </AutocompleteInput>
)
