import { ComponentMeta } from '@storybook/react'

import SearchInput from '.'

export default {
  title: 'shared/SearchInput',
  component: SearchInput,
} as ComponentMeta<typeof SearchInput>

export const Index = () => <SearchInput placeholder="Type to search" />

export const WithRequired = () => (
  <SearchInput placeholder="Type to search" required />
)

export const WithTitle = () => (
  <SearchInput placeholder="Type to search" title="Title" />
)

export const Disabled = () => (
  <SearchInput placeholder="Type to search" disabled />
)

export const Valid = () => <SearchInput placeholder="Type to search" valid />

export const Invalid = () => (
  <SearchInput placeholder="Type to search" valid={false} />
)

export const ReadOnly = () => (
  <SearchInput
    placeholder="Type to search"
    className="w-full"
    value="Hello!"
    aria-readonly
  />
)
